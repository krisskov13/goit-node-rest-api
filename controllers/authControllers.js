import * as fs from "node:fs/promises";
import path from "node:path";
import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import sendVerificationEmail from "../helpers/mail.js";

export const register = async (req, res, next) => {
  try {
    const { password, email } = req.body;

    const exist = await User.findOne({ email });
    if (exist) {
      throw HttpError(409, "Email in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { protocol: "http" });
    const verificationToken = nanoid();

    const createdUser = await User.create({
      password: passwordHash,
      email,
      avatarURL,
      verificationToken,
    });

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      user: {
        email: createdUser.email,
        subscription: createdUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { password, email } = req.body;

    const exist = await User.findOne({ email });
    if (!exist) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isMatch = await bcrypt.compare(password, exist.password);
    if (!isMatch) {
      throw HttpError(401, "Email or password is wrong");
    }

    if (!exist.verify) {
      throw HttpError(401, "Please, verify your email");
    }

    const token = jwt.sign(
      { id: exist._id, email: exist.email },
      process.env.JWT_SECRET,
      { expiresIn: "2 days" }
    );

    await User.findByIdAndUpdate(exist._id, { token });

    res.status(200).json({
      token,
      user: {
        email: exist.email,
        subscription: exist.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { id } = req.user;
    await User.findByIdAndUpdate(id, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const current = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatars = async (req, res, next) => {
  try {
    const { path: tempPath, filename } = req.file;

    const avatar = await Jimp.read(tempPath);
    await avatar.resize(250, 250).writeAsync(tempPath);

    await fs.rename(tempPath, path.resolve("public/avatars", filename));

    const avatarURL = `/avatars/${filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL },
      { new: true }
    );

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export const verify = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const resendEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    await sendVerificationEmail(email, user.verificationToken);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
