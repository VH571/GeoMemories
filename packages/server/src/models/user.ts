import { Schema, model } from "mongoose";

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  hashedPassword: string;
  profilePicture?: string;
}

const UserSchema = new Schema<User>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    hashedPassword: { type: String, required: true },
    profilePicture: { type: String, trim: true },
  },
  { collection: "users" }
);

const UserModel = model<User>("User", UserSchema);
export default UserModel;
