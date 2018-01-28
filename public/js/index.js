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
  });

  //chat functionality
  $("#message-form").on("submit", function (e) {
    e.preventDefault();
    const messageBody = $("#form-msg");
    socket.emit(
      "createMessage",
      {
        from: "Gee",
        body: messageBody.val(),
      },
      function () {
        console.log("Hola got your message");
      }
    );
    messageBody.val("");
  });

  //Geolocation feature
  const locationButton = $("#location");
  locationButton.on("click", function () {
    if (!navigator.geolocation) {
      return alert("geolocation does not exist for your browser");
    }
    const successHandler = function (position) {
      socket.emit("createLocationMessage", {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };
    const failureHandler = function (e) {
      console.log(e);
      alert("Unable to fetch location");
    };
    navigator.geolocation.getCurrentPosition(successHandler, failureHandler);
  });

  //handle location message
  socket.on("newLocationMessage", function (message) {
    const li = $("<li></li>");
    const a = $('<a target="_blank"></a>');
    a.attr("href", message.url);
    li.text(message.from + ": ");
    li.append(a);
    $("#msg-list").append(li);
  });
});
