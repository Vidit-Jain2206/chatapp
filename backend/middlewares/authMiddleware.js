import jwt from "jsonwebtoken";
import { USERS } from "../models/user.js";

export const authenticateJWT = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const userId = jwt.verify(token, process.env.JWT_SECRET);
      const user = await USERS.findById(userId.id).select("-password");
      req.user = user;
      next();
    } catch (error) {
      res.status(400);
      throw new Error("Not Authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("No authorized, no token");
  }
};
