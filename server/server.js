const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "../public")));

io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("createMessage", (data) => {
    io.emit("newMessage", {
      from: data.from,
      message: data.message,
      createdAt: new Date().getTime(),
    });
  });
  socket.on("disconnect", () => console.log("Client leaving :( "));
});

server.listen(port, () => console.log(`App running on port ${port}`));
