$(function () {
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

  $("#message-form").on("submit", function (e) {
    e.preventDefault();
    const messageBody = $("#form-msg");
    socket.emit(
      "createMessage",
      {
        from: "Guy Mans",
        body: messageBody.val(),
      },
      function () {
        console.log("Hola got your message");
      }
    );
    messageBody.val("");
  });

  const locationButton = $("#location");
  locationButton.on("click", function () {
    if (!navigator.geolocation) {
      return alert("geolocation does not exist for your browser");
    }
    navigator.geolocation.getCurrentPosition(
      function (position) {
        socket.emit("createLocationMessage", {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      function (e) {
        console.log(e);
        alert("Unable to fetch location");
      }
    );
  });
});
