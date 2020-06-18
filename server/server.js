const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const _ = require("lodash");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const Users = require("./utils/users");
const { isRealString } = require("./utils/validate");
const { genMessage, genLocMessage } = require("./utils/message");
const port = process.env.PORT || 5000;
const users = new Users();
var roomsList = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.get("/roomslist", (req, res) => {
  res.send({ roomsList });
});
app.post("/chat", (req, res) => {
  res.setHeader("Location", "/chat.html");
  const body = _.pick(req.body, "name", "room");
  console.log(body);
  res.cookie("data", JSON.stringify(body));
  res.status(301).send();
});
app.use(express.static(path.join(__dirname, "../public")));

io.on("connection", (socket) => {
  socket.on("join", (params, cbfunc) => {
    const usersList = users.getUsersList(params.room);
    if (usersList.includes(params.name)) {
      return cbfunc("Display name belongs to someone else");
    }
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return cbfunc("Error validating data");
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    if (!roomsList.includes(params.room)) {
      roomsList.push(params.room);
    }
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
      if (users.getUsersList(user.room).length <= 0) {
        roomsList = roomsList.filter((room) => user.room !== room);
      }
    }
  });
});

server.listen(port, () => console.log(`App running on port ${port}`));
