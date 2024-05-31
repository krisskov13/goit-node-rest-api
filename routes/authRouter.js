import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  createUserSchema,
  createLoginSchema,
  createVerifySchema,
} from "../schemas/authSchemas.js";
import {
  register,
  login,
  logout,
  current,
  uploadAvatars,
  verify,
  resendEmail,
} from "../controllers/authControllers.js";
import { auth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(createUserSchema), register);
authRouter.post("/login", validateBody(createLoginSchema), login);
authRouter.post("/logout", auth, logout);
authRouter.post("/current", auth, current);
authRouter.patch("/avatars", auth, upload.single("avatar"), uploadAvatars);
authRouter.get("/verify/:verificationToken", verify);
authRouter.post("/verify", validateBody(createVerifySchema), resendEmail);

export default authRouter;
