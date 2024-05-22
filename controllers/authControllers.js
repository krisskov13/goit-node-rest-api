import * as fs from "node:fs/promises";
import path from "node:path";
import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";

export const register = async (req, res, next) => {
  try {
    const { password, email } = req.body;

    const exist = await User.findOne({ email });
    if (exist) {
      throw HttpError(409, "Email in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email, { protocol: "http" });
    const createdUser = await User.create({
      password: passwordHash,
      email,
      avatarURL,
    });
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

    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};
