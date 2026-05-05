import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    verifyOtp: string;
    verifyOtpExpireAt: number;
    isAccountVerfied: boolean;
    resetOtp: string;
    resetOtpExpireAt: number;
}

const userSchema: Schema<IUser> = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    verifyOtp: {type: String, default: ''},
    verifyOtpExpireAt: {type: Number, default: 0},
    isAccountVerfied: {type: Boolean, default: false},
    resetOtp: {type: String, default: ''},
    resetOtpExpireAt: {type: Number, default: 0},
})

const userModel: Model<IUser> = mongoose.models.user || mongoose.model<IUser>('user', userSchema)
export default userModel;
