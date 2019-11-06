$(document).ready(function() {
  const inputNum = document.getElementById("inputNum");
  const textArea = document.getElementById("input");
  let messages;

  $("form").on("submit", function() {
    var message = $("#input");
    var messageNum = $("#inputNum");
    var messagesTxt = {
      answer: message
        .val()
        .toLowerCase()
        .trim()
    };
    var messagesNum = {
      answer: messageNum.val()
    };

    if (inputNum.style.display == "none") {
      messages = messagesTxt;
    } else {
      messages = messagesNum;
    }

    $.ajax({
      type: "POST",
      url: "/",
      data: messages,
      success: function(data) {
        location.reload();
      }
    });

    return false;
  });

  // Switch between text area and number only input depending on question
  const lastMessage = document.getElementById("message-table").childNodes[1]
    .lastElementChild.innerHTML;

  if (lastMessage.includes("How many")) {
    inputNum.style.display = "inline-block";
    inputNum.required = true;
    textArea.style.display = "none";
    textArea.required = false;
  } else {
    inputNum.style.display = "none";
    inputNum.required = false;

    textArea.style.display = "inline-block";
    textArea.required = true;
  }
});

// Keep scrolled to bottom
const messagesArea = document.querySelector("ul");
messagesArea.scrollTop = messagesArea.scrollHeight;
