const { Server } = require("socket.io");

const io = new Server({ cors: "front-end address" });

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("new connection", socket.id);

  // LISTEN TO A CONNECTION
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({ userId, socketId: socket.id });
    socket.emit("getOnlineUsers", onlineUsers);
  });

  // SEND MESSAGE
  socket.on("getMessage", (message) => {
    try {
      const user = onlineUsers.find(
        (user) => user.userId === message.recipientId
      );

      if (user) {
        io.to(user.socketId).emit("getMessage", message);
      }
    } catch (error) {
      console.error("Error handling getMessage:", error);
    }
  });

  // HANDLE USER DISCONNECTION
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3000);
