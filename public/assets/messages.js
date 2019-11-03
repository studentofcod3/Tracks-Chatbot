$(document).ready(function() {
  $("form").on("submit", function() {
    var message = $("#input");
    var messages = {
      answer: message
        .val()
        .toLowerCase()
        .trim()
    };
    $.ajax({
      type: "POST",
      url: "/",
      data: messages,
      success: function(data) {
        location.reload();
      }
    });

    // setTimeout(() => {
    //   $.ajax({
    //     type: "POST",
    //     url: "/",
    //     data: messages,
    //     success: function(data) {
    //       location.reload();
    //       console.log("page reload");
    //     }
    //   });
    // }, 1000);

    return false;
  });
});
