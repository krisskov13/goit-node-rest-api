import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const auth = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (typeof authorizationHeader === "undefined") {
    throw HttpError(401, "Not authorized");
  }

  const [bearer, token] = authorizationHeader.split(" ", 2);
  if (bearer !== "Bearer") {
    throw HttpError(401, "Not authorized");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (error, decode) => {
    if (error) {
      throw HttpError(401, "Not authorized");
    }

    try {
      const user = await User.findById(decode.id);

      if (!user || user.token !== token) {
        throw HttpError(401, "Not authorized");
      }

      req.user = user;

      next();
    } catch (error) {
      next(error);
    }
  });
};
