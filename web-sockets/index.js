const express = require("express");
const path = require("path");
const http = require("http");
const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));

const server = http.createServer(app);

// Step 0 : import socket.io
const { Server } = require("socket.io");
// creating Instance of socket.io
const io = new Server(server);

// Step1 : when connection is established
io.on("connection", (socket) => {
  console.log("🚀 Connection Established");

  // Step1a : when we receive a message : Listening for the event
  socket.on("chat-message", (message) => {
    console.log("🚀 Message Received", message);
    // Step1aa : emit the message to all connected clients : Broadcasting the message
    io.emit("chat-message", message);
  });

  // Step1b : when connection is disconnected
  socket.on("disconnect", () => {
    console.log("🚀 Disconnected");
  });
});

// Route for the index page
app.get("/", (req, res) => {
  console.log("📄 Serving index.html page");
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log("\n🚀 Server is running on port", PORT);
  console.log("🌐 WebSocket demo available at http://localhost:" + PORT);
});
