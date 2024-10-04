import { Server } from "socket.io";
import User from "../shared/classes/user";

const io = new Server(4000, {
  cors: {
    origin: ["http://127.0.0.1:5500", "http://192.168.178.58:5500"],
  },
});

let usersActive = new Set();

io.on("connection", (socket) => {

  console.log("Socket connected:", socket.id);

  socket.on("join-room", ({ username, room }) => {
    let user = new User(socket.id, username, room); // make a user object

    socket.join(user.room); // add socket to room

    connectedClients.add(user); // add user to set of users

    // socket.emit("welcome-message", {}); // send welcome message to user

    // socket.to(user.room).broadcast.emit("join-message", {}); // broadcast connect message to room user joined

    sendListUsernames(user.room); // send user and room info
  });

  socket.on("send-message", (message) => {
    console.log(message);
    socket.to(user.room).broadcast.emit("recieve-message", message);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);

    connectedClients.forEach((user) => {
      if (user.id === socket.id) {
        connectedClients.delete(user);
      }
    });

    connectedClients.forEach((user) => {
      sendListUsernames(user.room);
    });
  });

  function sendListUsernames(room) {
    const usernames = Array.from(connectedClients)
      .filter((user) => user.room === room)
      .map((user) => user.username);

    io.to(room).emit("user-list", usernames);
  }
});
