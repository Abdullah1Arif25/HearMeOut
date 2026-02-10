const { Server } = require("socket.io");

module.exports = function setupSocket(httpServer, app) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // load live chat logic
  require("../socket/liveChat.socket")(io);
  app.set("io", io);
  console.log("Socket running.");
};