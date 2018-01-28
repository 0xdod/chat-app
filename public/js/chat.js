$(function () {
  var socket = io();
  var messages = $("#messages");
  var messageTextBox = $("#form-msg");
  var sendButton = $('[type="submit"]');
  var scrollToBottom = function () {
    var newMessage = messages.children("li:last-child");
    var clientHeight = messages.prop("clientHeight");
    var scrollHeight = messages.prop("scrollHeight");
    var scrollTop = messages.prop("scrollTop");
    var newMessageHeight = newMessage.innerHeight();
    var prevMessageHeight = newMessage.prev().innerHeight();
    if (
      clientHeight + scrollTop + newMessageHeight + prevMessageHeight >=
      scrollHeight
    ) {
      messages.scrollTop(scrollHeight);
    }
  };

  socket.on("connect", function () {
    var params = $.deparam(window.location.search);
    params.room = params.room.toLowerCase();
    socket.emit("join", params, function (err) {
      if (err) {
        alert(err);
        window.location.href = "/";
        return;
      } else {
        console.log("Ko si wahala");
      }
    });
  });

  socket.on("disconnect", function () {
    console.log("disonnected");
  });

  socket.on("updateUsersList", function (users) {
    var ol = $("<ul></ul>");
    users.forEach(function (user) {
      ol.append($("<li></li>").text(user));
    });
    $("#users").html(ol);
  });

  //chat functionality
  socket.on("newMessage", function (message) {
    var formattedTime = moment(message.createdAt).format("h:mm a");
    var template = $("#message-template").html();
    var html = Mustache.render(template, {
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
        body: messageTextBox.val(),
      },
      function () {
        messageTextBox.val("");
        sendButton.attr("disabled", "disabled");
      }
    );
  });

  //Geolocation feature
  var locationButton = $("#location");
  locationButton.on("click", function () {
    if (!navigator.geolocation) {
      return alert("geolocation does not exist for your browser");
    }
    locationButton.attr("disabled", "disabled").text("Sending location...");
    var successHandler = function (position) {
      locationButton.removeAttr("disabled").text("Send location");
      socket.emit("createLocationMessage", {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };
    var failureHandler = function (err) {
      locationButton.removeAttr("disabled").text("Send location");
      console.log(err);
      alert("Unable to fetch location");
    };
    navigator.geolocation.getCurrentPosition(successHandler, failureHandler);
  });

  //handle location message
  socket.on("newLocationMessage", function (message) {
    var formattedTime = moment(message.createdAt).format("h:mm a");
    var template = $("#location-message-template").html();
    var html = Mustache.render(template, {
      from: message.from,
      url: message.url,
      time: formattedTime,
    });
    messages.append(html);
    scrollToBottom();
  });
});
