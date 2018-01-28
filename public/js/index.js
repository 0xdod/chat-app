$(function () {
  var selectEl = $('[name="active-rooms"]');
  var roomEl = $('[name="room"]');
  $("input:text").each(function (_, el) {
    $(el).val("");
  });
  selectEl.on("change", function (e) {
    roomEl.val(e.target.value);
  });
  function loadRooms() {
    $.getJSON("/roomslist")
      .done(function (res) {
        var rooms = $(res.roomsList);
        if (rooms.length == 0) {
          return $("#active-rooms").attr("class", "disabled");
        }
        rooms.each(function (_, val) {
          var optionEl = $("<option></option>");
          optionEl.attr("value", val);
          optionEl.text(val);
          selectEl.append(optionEl);
        });
      })
      .fail(function (err) {
        $("#active-rooms").attr("class", "disabled");
      });
  }
  loadRooms();
});
