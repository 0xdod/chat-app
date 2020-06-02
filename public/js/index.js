const socket = io();
socket.on("connect", function () {
  console.log("Connected");
});
socket.on("disconnect", function () {
  console.log("disonnected");
});
socket.on("newMessage", function (msg) {
  const li = $("<li></li>");
  li.text(`${msg.from}: ${msg.body}`);
  $("#msg-list").append(li);
  console.log(`New message from ${msg.from}`, msg);
});

$(function () {
  $("#message-form").on("submit", function (e) {
    e.preventDefault();
    socket.emit(
      "createMessage",
      {
        from: "Guy Mans",
        message: $("#form-msg").val(),
      },
      function () {
        console.log("Hola got you message");
      }
    );
  });
});
