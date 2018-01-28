const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const { genMessage, genLocMessage } = require("./utils/message");
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "../public")));

io.on("connection", (socket) => {
  socket.emit("newMessage", genMessage("Admin", "Welcome to the chat room"));

  socket.broadcast.emit(
    "newMessage",
    genMessage("Admin", "New user joined the chat")
  );

  socket.on("createMessage", (msg, cb) => {
    io.emit("newMessage", genMessage(msg.from, msg.body));
    cb();
  });

  socket.on("createLocationMessage", (coords) => {
    io.emit(
      "newLocationMessage",
      genLocMessage("Admin", coords.lat, coords.lng)
    );
  });

  socket.on("disconnect", () => console.log("Client leaving :( "));
});

server.listen(port, () => console.log(`App running on port ${port}`));
