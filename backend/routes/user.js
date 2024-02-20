import express from "express";
import {
  handleUserSignup,
  handleUserLogin,
  getAllUsers,
} from "../controllers/user.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
export const router = express.Router();

router.get("/allusers", authenticateJWT, getAllUsers);
router.post("/login", handleUserLogin);
router.post("/signup", handleUserSignup);
