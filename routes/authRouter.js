import express from "express";
import validateBody from "../helpers/validateBody.js";
import { createUserSchema, createLoginSchema } from "../schemas/authSchemas.js";
import {
  register,
  login,
  logout,
  current,
  uploadAvatars,
} from "../controllers/authControllers.js";
import { auth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(createUserSchema), register);
authRouter.post("/login", validateBody(createLoginSchema), login);
authRouter.post("/logout", auth, logout);
authRouter.post("/current", auth, current);
authRouter.patch("/avatars", auth, upload.single("avatar"), uploadAvatars);

export default authRouter;
