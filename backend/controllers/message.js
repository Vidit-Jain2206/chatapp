import { CHATS } from "../models/chat.js";
import { MESSAGES } from "../models/message.js";
import { USERS } from "../models/user.js";

export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    try {
      throw new Error("Invalid data passed into request");
    } catch (error) {
      res.status(402).json({ message: error.message });
      return;
    }
  }
  try {
    var newMessage = new MESSAGES({
      sender: req.user._id,
      content,
      chatId,
    });

    await newMessage.save();
    newMessage = await newMessage.populate("sender", "username pic");
    newMessage = await newMessage.populate("chatId");
    newMessage = await USERS.populate(newMessage, {
      path: "chatId.users",
      select: "username pic email",
    });
    await CHATS.findByIdAndUpdate(req.body.chatId, {
      latestMessage: newMessage,
    });
    return res.json(newMessage);
  } catch (error) {
    res.sendStatus(400);
    throw new Error(error.message);
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await MESSAGES.find({
      chatId: req.params.chatId,
    })
      .populate("sender", "username pic email")
      .populate("chatId");

    res.json(messages);
  } catch (error) {
    res.sendStatus(400);
    throw new Error(error.message);
  }
};
