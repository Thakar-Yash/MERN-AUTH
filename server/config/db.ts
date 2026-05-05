import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined");
    }

    mongoose.connection.on("connected", () => {
      console.log("Database Connected");
    });

    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error("DB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;