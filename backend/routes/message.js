import express from "express";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { getAllMessages, sendMessage } from "../controllers/message.js";
export const router = express.Router();

router.route("/").post(authenticateJWT, sendMessage);
router.route("/:chatId").get(authenticateJWT, getAllMessages);
