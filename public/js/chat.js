$(function () {
  const socket = io();
  const messages = $("#messages");
  const messageTextBox = $("#form-msg");
  const sendButton = $('[type="submit"]');
  const scrollToBottom = function () {
    const newMessage = messages.children("li:last-child");
    const clientHeight = messages.prop("clientHeight");
    const scrollHeight = messages.prop("scrollHeight");
    const scrollTop = messages.prop("scrollTop");
    const newMessageHeight = newMessage.innerHeight();
    const prevMessageHeight = newMessage.prev().innerHeight();
    if (
      clientHeight + scrollTop + newMessageHeight + prevMessageHeight >=
      scrollHeight
    ) {
      messages.scrollTop(scrollHeight);
    }
  };

  socket.on("connect", function () {
    console.log("Connected");
  });
  socket.on("disconnect", function () {
    console.log("disonnected");
  });

  //chat functionality
  socket.on("newMessage", function (message) {
    const formattedTime = moment(message.createdAt).format("h:mm a");
    const template = $("#message-template").html();
    const html = Mustache.render(template, {
      from: message.from,
      body: message.body,
      time: formattedTime,
    });
    messages.append(html);
    scrollToBottom();
  });

  messageTextBox.on("focusin focusout input", function (e) {
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
      locationButton.removeAttr("disabled").text("Send location");
      console.log(err);
      alert("Unable to fetch location");
    };
    navigator.geolocation.getCurrentPosition(successHandler, failureHandler);
  });

  //handle location message
  socket.on("newLocationMessage", function (message) {
    const formattedTime = moment(message.createdAt).format("h:mm a");
    const template = $("#location-message-template").html();
    const html = Mustache.render(template, {
      from: message.from,
      url: message.url,
      time: formattedTime,
    });
    messages.append(html);
    scrollToBottom();
  });
});
