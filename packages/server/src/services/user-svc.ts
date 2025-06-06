import bcrypt from "bcryptjs";
import UserModel, { User } from "../models/user.js";

function create(userData: Omit<User, "hashedPassword"> & { password: string }): Promise<User> {
  if (!userData.firstName || !userData.lastName || !userData.username || !userData.password) {
    return Promise.reject(new Error("Missing required user fields"));
  }

  return UserModel.findOne({ username: userData.username })
    .then((existing) => {
      if (existing) throw new Error(`Username exists: ${userData.username}`);
      return bcrypt.genSalt(10);
    })
    .then((salt) => bcrypt.hash(userData.password, salt))
    .then((hashedPassword) => {
      const user = new UserModel({
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        hashedPassword
      });
      return user.save();
    });
}

function verify(username: string, password: string): Promise<User> {
  return UserModel.findOne({ username }).then((found) => {
    if (!found) throw new Error("Invalid username or password");

    return bcrypt.compare(password, found.hashedPassword).then((match) => {
      if (!match) throw new Error("Invalid username or password");
      return found;
    });
  });
}

function getById(userId: string) {
  return UserModel.findById(userId);
}

export default { create, verify, getById };
