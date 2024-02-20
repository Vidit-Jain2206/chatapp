import { CHATS } from "../models/chat.js";
import { USERS } from "../models/user.js";

export const accessChats = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await CHATS.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await USERS.populate(isChat, {
    path: "latestMessage.sender",
    select: "username pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await CHATS.create(chatData);
      const FullChat = await CHATS.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

export const fetchChats = async (req, res) => {
  try {
    var allChats = await CHATS.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("groupAdmin", "-password")
      .sort({ updatedAt: -1 });

    allChats = await USERS.populate(allChats, {
      path: "latestMessage.sender",
      select: "username pic email",
    });
    res.status(200).send(allChats);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

export const createGroupChat = async (req, res) => {
  let { users, chatName } = req.body;
  console.log(users);
  console.log(chatName);
  if (!users || !chatName) {
    try {
      throw new Error("Please enter all the fields");
    } catch (error) {
      res.status(400);
      return res.json({ message: error.message });
    }
  }

  users = JSON.parse(users);
  if (users.length < 2) {
    try {
      throw new Error("More than two users are required to form groupChat");
    } catch (error) {
      res.status(400);

      return res.json({ message: error.message });
    }
  }

  users.push(req.user);
  try {
    const groupChat = await CHATS.create({
      chatName: chatName,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await CHATS.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return res.status(201).send(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

export const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await CHATS.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    try {
      throw new Error("Cannot find Chat");
    } catch (error) {
      res.status(400);
      res.json({ message: error.message });
    }
  } else {
    res.json(updatedChat);
  }
};

export const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await CHATS.findByIdAndUpdate(
    chatId,
    {
      $push: {
        users: userId,
      },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    try {
      throw new Error("Cannot find Chat");
    } catch (error) {
      res.status(400);
      res.json({ message: error.message });
    }
  } else {
    res.json(added);
  }
};

export const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const remove = await CHATS.findByIdAndUpdate(
    chatId,
    {
      $pull: {
        users: userId,
      },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!remove) {
    try {
      throw new Error("Chat Not Found");
    } catch (error) {
      res.status(400);
      res.json({ message: error.message });
    }
  } else {
    res.json(remove);
  }
};
