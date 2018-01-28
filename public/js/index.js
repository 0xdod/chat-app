const socket = io();
socket.on("connect", function () {
  console.log("Connected");
  console.log("-------------");
  socket.emit("createMessage", {
    from: "pakistani guy",
    message: "Hello guys",
  });
});
socket.on("disconnect", function () {
  console.log("disonnected");
});
socket.on("newMessage", function (msg) {
  console.log("New message created", msg);
});
