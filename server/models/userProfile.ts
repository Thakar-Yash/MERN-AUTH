import mongoose, { Document, Schema } from "mongoose";

export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  profileImage: string;
}

const userProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUserProfile>(
  "UserProfile",
  userProfileSchema
);