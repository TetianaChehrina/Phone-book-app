import express from "express";
import { validateBody } from "../utils/validateBody.js";
import { createUserSchema, loginUserSchema } from "../validation/users.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUser,
  updateUserProfile,
} from "../controllers/users.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { checkToken } from "../middlewares/checkToken.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.post(
  "/signup",
  upload.single("avatar"),
  validateBody(createUserSchema),
  ctrlWrapper(registerUser)
);

router.post("/login", validateBody(loginUserSchema), ctrlWrapper(loginUser));
router.patch(
  "/profile",
  checkToken,
  upload.single("avatar"),
  ctrlWrapper(updateUserProfile)
);

router.post("/logout", checkToken, ctrlWrapper(logoutUser));
router.get("/current", checkToken, ctrlWrapper(refreshUser));

export default router;
