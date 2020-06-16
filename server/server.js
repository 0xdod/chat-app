const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const Users = require("./utils/users");
const { isRealString } = require("./utils/validate");
const { genMessage, genLocMessage } = require("./utils/message");
const port = process.env.PORT || 5000;
const users = new Users();

app.use(express.static(path.join(__dirname, "../public")));

io.on("connection", (socket) => {
  socket.on("join", (params, cbfunc) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return cbfunc("Error validating data");
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit("updateUsersList", users.getUsersList(params.room));
    socket.emit("newMessage", genMessage("admin", "Welcome to the chat room"));
    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        genMessage("admin", params.name + " has joined the chat")
      );
    cbfunc();
  });

  socket.on("createMessage", (msg, cb) => {
    const user = users.getUser(socket.id);
    if (user && isRealString(msg.body)) {
      io.to(user.room).emit("newMessage", genMessage(user.name, msg.body));
    }

    cb();
  });

  socket.on("createLocationMessage", (coords) => {
    const user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "newLocationMessage",
        genLocMessage(user.name, coords.lat, coords.lng)
      );
    }
  });

  socket.on("disconnect", () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("updateUsersList", users.getUsersList(user.room));
      io.to(user.room).emit(
        "newMessage",
        genMessage("admin", `${user.name} left the room`)
      );
    }
  });
});

server.listen(port, () => console.log(`App running on port ${port}`));
