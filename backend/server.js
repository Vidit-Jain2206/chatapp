import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import { router as userRouter } from "./routes/user.js";
import { router as chatRouter } from "./routes/chat.js";
import { router as messageRouter } from "./routes/message.js";
import { NotFound, ErrorHandler } from "./middlewares/errorHandlers.js";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import path from "path";
const app = express();
dotenv.config();

connectDb();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend2/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend2", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

app.use(NotFound);
app.use(ErrorHandler);

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Sever is running on ${port}`);
});
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("setup", (userData) => {
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chatId;
    if (!chat.users) {
      return console.log("chat.users not defined");
    }
    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) {
        return;
      }
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("start typing", ({ room, user }) =>
    socket.in(room).emit("start typing", user)
  );

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("start video call", ({ room, user }) => {
    socket.in(room).emit("request video call", user);
  });

  socket.off("setup", (userData) => {
    console.log("USER disconnected");
    socket.leave(userData._id);
  });
});
