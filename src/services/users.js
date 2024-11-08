import { User } from "../db/models/User.js";
import { env } from "../utils/env.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const findUserByEmail = (email) => User.findOne({ email });

export const updateUserWithToken = (id) => {
  const token = jwt.sign({ id }, env("JWT_SECRET"));
  return User.findByIdAndUpdate(id, { token }, { new: true });
};

export const createUser = async (userData) => {
  const hashPassword = await bcrypt.hash(userData.password, 10);

  const user = await User.create({
    ...userData,
    password: hashPassword,
  });

  return updateUserWithToken(user._id);
};

export const findUserById = async (userId) => {
  return User.findById(userId);
};

export const updateUserService = async (userId, updates) => {
  return User.findByIdAndUpdate(userId, updates, { new: true });
};

export const resetToken = async (id) => {
  return User.findByIdAndUpdate(id, { token: " " });
};
