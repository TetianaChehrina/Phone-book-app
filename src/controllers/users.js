import createHttpError from "http-errors";
import {
  findUserByEmail,
  createUser,
  updateUserWithToken,
  resetToken,
  findUserById,
  updateUserService,
} from "../services/users.js";
import bcrypt from "bcryptjs";
import cloudinary from "../cloudinaryConfig.js";

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const user = await findUserByEmail(email);
    if (user) throw createHttpError(409, "Email in use");

    let avatarURL = "";

    if (req.file) {
      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "user_avatars" },
          (error, result) => {
            if (error) {
              return reject(
                new createHttpError(500, "Failed to upload avatar")
              );
            }
            resolve(result.secure_url);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      avatarURL = uploadResponse;
    }

    const newUser = await createUser({ name, email, password, avatarURL });

    res.json({
      token: newUser.token,
      user: {
        name: newUser.name,
        email: newUser.email,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    console.error("Register user error:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) throw createHttpError(401, "User not found");
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) throw createHttpError(401, "User not found");
  const updatedUser = await updateUserWithToken(user._id);
  res.json({
    token: updatedUser.token,
    user: {
      name: updatedUser.name,
      email,
    },
  });
}

export async function logoutUser(req, res) {
  await resetToken(req.user._id);
  res.status(204).end();
}

export function refreshUser(req, res) {
  const { name, email, avatarURL } = req.user;
  res.json({
    name,
    email,
    avatarURL,
  });
}

export async function updateUserProfile(req, res, next) {
  try {
    const user = await findUserById(req.user.id);
    if (!user) throw createHttpError(404, "User not found");

    const { name, oldPassword, newPassword } = req.body;
    const updates = {};
    if (name) updates.name = name;

    if (oldPassword && newPassword) {
      const isCorrectPassword = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isCorrectPassword) {
        return next(createHttpError(400, "Incorrect old password"));
      }
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "user_avatars" },
          (error, result) => {
            if (error)
              return reject(createHttpError(500, "Failed to upload avatar"));
            resolve(result.secure_url);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      updates.avatarURL = result;
    }

    const updatedUser = await updateUserService(req.user.id, updates);

    if (!updatedUser) {
      throw createHttpError(404, "Failed to update user");
    }

    res.json({
      name: updatedUser.name,
      email: updatedUser.email,
      avatarURL: updatedUser.avatarURL,
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    next(createHttpError(error.status || 500, error.message));
  }
}
