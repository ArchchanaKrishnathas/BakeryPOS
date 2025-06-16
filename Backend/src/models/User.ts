import mongoose, { Document, Schema } from "mongoose";

// Define a TypeScript interface for User
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "user" | "staff" | "admin";
  loyaltyPoints?: number;
}

// Define the schema
const userSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "staff", "admin"],
      default: "user",
    },
    loyaltyPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Export the Mongoose model
const User = mongoose.model<IUser>("User", userSchema);
export default User;
