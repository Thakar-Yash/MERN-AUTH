import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from "jsonwebtoken"

export interface AuthRequest extends Request {
    userId?:string
}

const userAuth = async (req: AuthRequest, 
    res: Response, 
    next: NextFunction):
    Promise<Response | void> => {
    const { token } = req.cookies;
    if(!token){
        return res.status(400).json({
            success: false,
            message: 'Not Autherized, Login Again!'
        });
    }

    try {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
        throw new Error("JWT_SECRET is not defined");
        }

        const tokenDecode = jwt.verify(token, secret) as JwtPayload;
        
        if(tokenDecode.id){
            req.userId = tokenDecode.id
        }else{
            return res.status(400).json({
                success: false,
                message: 'Not Autherized, Login Again!'
            });
        }

        next();

    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Internal Server Error";

        return res.status(500).json({
            success: false,
            message,
        });
    }

}

export default userAuth