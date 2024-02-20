import express from "express";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
  accessChats,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} from "../controllers/chat.js";
export const router = express.Router();

router.post("/", authenticateJWT, accessChats);
router.get("/", authenticateJWT, fetchChats);
router.post("/group", authenticateJWT, createGroupChat);
router.put("/grouprename", authenticateJWT, renameGroup);
router.put("/groupremove", authenticateJWT, removeFromGroup);
router.put("/groupadd", authenticateJWT, addToGroup);
