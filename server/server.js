import { Server } from "socket.io";
import Message from "../shared/classes/message.js";
import User from "../shared/classes/user.js";

const io = new Server(4000, {
  cors: {
    origin: ["http://127.0.0.1:5500", "http://192.168.178.58:5500"],
  },
});

let usersActive = new Set();
const serverName = "server";
const serverId = "007";

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-room", ({ username, room }) => {
    const user = new User(socket.id, username, room); // make a user object

    console.log(user);

    socket.join(user.room); // add socket to room

    usersActive.add(user); // add user to set of users

    socket.emit(
      "welcome-message",
      new Message(serverName, serverId, "Welcome to the chatroom!")
    ); // send welcome message to user

    socket
      .to(user.room)
      .emit(
        "server-message",
        new Message(
          serverName,
          serverId,
          `${user.username} has joined the chat`
        )
      ); // broadcast connect message to room user joined

    sendListUsernames(user.room); // send user and room info
  });

  socket.on("send-message", (_message) => {
    console.log(_message);
    const user = findUser(socket.id);
    if (user) {
      const message = new Message(user.username, user.id, _message.content);
      socket.to(user.room).emit("recieve-message", message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    const user = findUser(socket.id);
    socket
      .to(user.room)
      .emit(
        "server-message",
        new Message(serverName, serverId, `${user.username} has left the chat`)
      ); // broadcast connect message to room user left

    usersActive.forEach((user) => {
      if (user.id === socket.id) {
        usersActive.delete(user);
      }
    });

    usersActive.forEach((user) => {
      sendListUsernames(user.room);
    });
  });

  function sendListUsernames(room) {
    const usernames = Array.from(usersActive)
      .filter((user) => user.room === room)
      .map((user) => user.username);

    io.to(room).emit("user-list", usernames);
  }

  function findUser(id) {
    return Array.from(usersActive).find((u) => u.id === id);
  }
});
