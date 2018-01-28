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
  const messageTextBox = $("#form-msg");
  const sendButton = $('[type="submit"]');

  messageTextBox.on("focus focusin", function (e) {
    if (!e.target.value) {
      sendButton.attr("disabled", "disabled");
    } else {
      sendButton.removeAttr("disabled");
    }
  });

  messageTextBox.on("blur focusout", function (e) {
    if (!e.target.value) {
      sendButton.attr("disabled", "disabled");
    } else {
      sendButton.removeAttr("disabled");
    }
  });
  messageTextBox.on("input", function (e) {
    if (!e.target.value) {
      sendButton.attr("disabled", "disabled");
    } else {
      sendButton.removeAttr("disabled");
    }
  });

  $("#message-form").on("submit", function (e) {
    e.preventDefault();
    socket.emit(
      "createMessage",
      {
        from: "Gee",
        body: messageTextBox.val(),
      },
      function () {
        messageTextBox.val("");
        sendButton.attr("disabled", "disabled");
      }
    );
  });

  //Geolocation feature
  const locationButton = $("#location");
  locationButton.on("click", function () {
    if (!navigator.geolocation) {
      return alert("geolocation does not exist for your browser");
    }
    locationButton.attr("disabled", "disabled").text("Sending location...");
    const successHandler = function (position) {
      locationButton.removeAttr("disabled").text("Send location");
      socket.emit("createLocationMessage", {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };
    const failureHandler = function (err) {
      console.log(err);
      alert("Unable to fetch location");
      locationButton.removeAttr("disabled").text("Send location");
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
