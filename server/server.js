const io = require("socket.io")(4000, {
  cors: {
    origin: ["http://127.0.0.1:5500"],
  },
});

let connectedClients = new Set();

io.on("connection", (socket) => {
  // Connecting to server
  console.log("Socket connected:", socket.id);
  console.log("Connected to rooms:");
  socket.rooms.forEach((element) => {
    console.log(`- ${element}`);
  });

  connectedClients.add(socket.id);
  io.emit("clients-total", connectedClients.size);

  // Joining a room -> add functionality
  socket.on("join-room", ({ username, room }) => {
    // Make a user object {id,username,room}
    // socket.join(user.room)
    // send welcome message to user
    // broadcast connect message to room user joined
    // send user and room info
  });

  // Listen for messages
  socket.on("send-message", (message) => {
    console.log(message);
    socket.broadcast.emit("recieve-message", message);

    // send message to the room the user is currently in
    // io.to(user.room).emit()
  });

  // Disconnecting from server
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    connectedClients.delete(socket.id);
    io.emit("clients-total", connectedClients.size);
  });
});
