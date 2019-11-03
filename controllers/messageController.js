const bodyParser = require("body-parser");
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
let data = [
  {
    message: "hello, what's your name?"
  }
];

let urlencodedParser = bodyParser.urlencoded({ extended: true });

const messageController = app => {
  app.get("/", urlencodedParser, (req, res) => {
    res.render("message", { messages: data });
  });

  app.post("/", urlencodedParser, (req, res) => {
    data.push(req.body);

    if (data.length == 2) {
      data.push({ message: `Hi ${req.body.answer}, do you own trucks?` });
    }

    // Ask for total trucks
    if (data.length > 3) {
      if (
        !data.filter(e => e.message === "How many trucks do you own?").length >
        0
      ) {
        if (req.body.answer == "yes") {
          data.push({ message: "How many trucks do you own?" });
        } else if (req.body.answer == "no") {
          data.push({ message: "When you get some trucks, let us know!" });
        } else {
          data.push({
            message: "Sorry I don't understand. Do you own trucks?"
          });
        }
      }
    }

    // Ask if Monobrand or multiple Brands
    if (
      data.filter(e => e.message === "How many trucks do you own?").length > 0
    ) {
      if (
        !data.filter(e => e.message === "Are they the same brand?").length > 0
      ) {
        if (data[data.length - 1].message !== "How many trucks do you own?") {
          data.push({ message: "Are they the same brand?" });
        }
      }
    }

    // Path division based on brands
    if (data.filter(e => e.message === "Are they the same brand?").length > 0) {
      if (data[data.length - 2].message == "Are they the same brand?") {
        if (req.body.answer == "yes") {
          data.push({ message: "Which brand do you have?" });
        } else if (req.body.answer == "no") {
          data.push({ message: "What brands are they?" });
        }
      }
    }

    // SINGULAR BRAND
    if (data[data.length - 2].message == "Which brand do you have?") {
      data.push({
        message: `Are the ${req.body.answer} trucks of the same model?`
      });
    }

    // Singular Model
    if (data.filter(e => e.message === "Which brand do you have?").length > 0) {
      if (data[data.length - 1].answer == "yes") {
        data.push({
          message: "Which model are they?"
        });
      }
    }

    if (data[data.length - 2].message == "Which model are they?") {
      data.push({
        message: "What is the engine size?"
      });
    }

    if (data[data.length - 2].message == "What is the engine size?") {
      data.push({
        message: "How many axles do they have?"
      });
    }

    // Multiple Models
    if (data.filter(e => e.message === "Which brand do you have?").length > 0) {
      if (data[data.length - 1].answer == "no") {
        data.push({
          message: "Which models are they?"
        });
      }
    }

    if (data.filter(e => e.message === "Which brand do you have?").length > 0) {
      if (data[data.length - 2].message === "Which models are they?") {
        const answer = req.body.answer;
        const answerKey = answer.replace(" and ", " ");
        const answerSplit = answerKey.split(" ");

        data.push(`How many ${answerSplit[0]} trucks do you have?`);
      }
    }

    res.json(data);
  });
};

module.exports = {
  messageController,
  data
};
