import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const auth = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw HttpError(401, "Not authorized");
    }

    const [bearer, token] = authorizationHeader.split(" ", 2);
    if (bearer !== "Bearer") {
      throw HttpError(401, "Not authorized");
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id);

    if (!user || user.token !== token) {
      throw HttpError(401, "Not authorized");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
