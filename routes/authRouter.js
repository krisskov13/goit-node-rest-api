import express from "express";
import validateBody from "../helpers/validateBody.js";
import { createUserSchema, createLoginSchema } from "../schemas/authSchemas.js";
import {
  register,
  login,
  logout,
  current,
} from "../controllers/authControllers.js";
import { auth } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(createUserSchema), register);
authRouter.post("/login", validateBody(createLoginSchema), login);
authRouter.post("/logout", auth, logout);
authRouter.post("/current", auth, current);

export default authRouter;
