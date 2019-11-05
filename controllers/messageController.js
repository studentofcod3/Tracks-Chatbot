const bodyParser = require("body-parser");
const fs = require("fs");

let urlencodedParser = bodyParser.urlencoded({ extended: true });

let conv = [
  {
    message: "hello, what's your name?"
  }
];

let data = {
  name: "",
  numOfTrucks: "",
  monoBrand: true,
  multiBrand: false,
  brands: []
};

let modelsArr = [];
let brandsArr = [];

let brand;
let model;
let num;
let engineSize;
let axles;

const messageController = app => {
  app.get("/", urlencodedParser, (req, res) => {
    res.render("message", { messages: conv });
  });

  app.post("/", urlencodedParser, (req, res) => {
    conv.push(req.body);

    if (conv.length == 2) {
      data.name = req.body.answer;
      conv.push({ message: `Hi ${data.name}, do you own trucks?` });
    }

    // Ask for total trucks
    if (
      conv[conv.length - 2].message == `Hi ${data.name}, do you own trucks?` ||
      conv[conv.length - 2].message ==
        "Sorry I don't understand. Do you own trucks?"
    ) {
      if (
        !conv.filter(e => e.message === "How many trucks do you own?").length >
        0
      ) {
        let ans = req.body.answer;
        if (
          ans == "yes" ||
          ans == "y" ||
          ans == "yh" ||
          ans == "ys" ||
          ans == "ja" ||
          ans == "yah" ||
          ans == "yeah" ||
          ans == "ye" ||
          ans == "yea"
        ) {
          conv.push({ message: "How many trucks do you own?" });
        } else if (
          ans == "no" ||
          ans == "n" ||
          ans == "nein" ||
          ans == "nah" ||
          ans == "nope" ||
          ans == "ne"
        ) {
          conv.push({ message: "When you get some trucks, let us know!" });
        } else {
          conv.push({
            message: "Sorry I don't understand. Do you own trucks?"
          });
        }
      }
    }

    // Ask if Monobrand or Multiple Brands
    if (conv[conv.length - 2].message == "How many trucks do you own?") {
      data.numOfTrucks = req.body.answer;
      conv.push({ message: "Are they the same brand?" });
    }

    // Path division based on brands
    if (conv[conv.length - 2].message == "Are they the same brand?") {
      let ans = req.body.answer;
      if (
        ans == "yes" ||
        ans == "y" ||
        ans == "yh" ||
        ans == "ys" ||
        ans == "ja" ||
        ans == "yah" ||
        ans == "yeah" ||
        ans == "ye" ||
        ans == "yea"
      ) {
        data.monoBrand = true;
        conv.push({ message: "Which brand do you have?" });
      } else if (
        ans == "no" ||
        ans == "n" ||
        ans == "nein" ||
        ans == "nah" ||
        ans == "nope" ||
        ans == "ne"
      ) {
        data.monoBrand = false;
        data.multiBrand = true;
        conv.push({ message: "What brands are they?" });
      }
    }

    // SINGULAR BRAND
    if (conv[conv.length - 2].message == "Which brand do you have?") {
      brand = req.body.answer;
      conv.push({
        message: `Are the ${brand} trucks of the same model?`
      });
    }

    // Multiple Brands sorting
    if (conv[conv.length - 2].message == "What brands are they?") {
      const answer = req.body.answer;
      const answerCommaSpc = answer.replace(", ", " ");
      const answerComma = answerCommaSpc.replace(",", " ");
      const answerKey = answerComma.replace(" and ", " ");
      brandsArr = answerKey.split(" ");

      if (brandsArr.length > 0) {
        brand = brandsArr[0].trim();
        conv.push({ message: `How many ${brand} trucks do you have?` });
        brandsArr.shift();
      }
    }

    if (
      conv[conv.length - 2].message == `How many ${brand} trucks do you have?`
    ) {
      conv.push({
        message: `Are the ${brand} trucks of the same model?`
      });
    }

    // Singular Model
    if (
      conv[conv.length - 2].message ==
      `Are the ${brand} trucks of the same model?`
    ) {
      let ans = req.body.answer;
      if (
        ans == "yes" ||
        ans == "y" ||
        ans == "yh" ||
        ans == "ys" ||
        ans == "ja" ||
        ans == "yah" ||
        ans == "yeah" ||
        ans == "ye" ||
        ans == "yea"
      ) {
        conv.push({
          message: "Which model are they?"
        });
      }
    }

    // Multiple Models question
    if (
      conv[conv.length - 2].message ==
      `Are the ${brand} trucks of the same model?`
    ) {
      let ans = conv[conv.length - 1].answer;
      if (
        ans == "no" ||
        ans == "n" ||
        ans == "nein" ||
        ans == "nah" ||
        ans == "nope" ||
        ans == "ne"
      ) {
        conv.push({
          message: "Which models are they?"
        });
      }
    }

    // Multiple models sorting
    if (conv[conv.length - 2].message == `Which models are they?`) {
      const answer = req.body.answer;
      const answerCommaSpc = answer.replace(", ", " ");
      const answerComma = answerCommaSpc.replace(",", " ");
      const answerKey = answerComma.replace(" and ", " ");
      modelsArr = answerKey.split(" ");

      if (modelsArr.length > 0) {
        model = modelsArr[0].trim();
        conv.push({ message: `How many ${model} trucks do you have?` });
        modelsArr.shift();
      }
    }

    // Engine size
    if (
      conv[conv.length - 2].message == "Which model are they?" ||
      conv[conv.length - 2].message == `How many ${model} trucks do you have?`
    ) {
      let prevQues = conv[conv.length - 2].message;
      if (prevQues == "Which model are they?") {
        model = req.body.answer;
      } else if (prevQues == `How many ${model} trucks do you have?`) {
        num = req.body.answer;
      }

      conv.push({
        message: "What is the engine size?"
      });
    }

    // Number of axles
    if (conv[conv.length - 2].message == "What is the engine size?") {
      engineSize = req.body.answer;
      conv.push({
        message: "How many axles do they have?"
      });
    }

    // Save particular truck
    if (conv[conv.length - 2].message == "How many axles do they have?") {
      axles = req.body.answer;
      data.brands.push({
        truck: [{ brand, model, num, engineSize, axles }]
      });

      if (modelsArr.length > 0) {
        model = modelsArr[0];
        conv.push({ message: `How many ${model} trucks do you have?` });
        model = modelsArr[0];
        modelsArr.shift();
      } else if (brandsArr.length > 0) {
        brand = brandsArr[0];
        conv.push({ message: `How many ${brand} trucks do you have?` });
        brandsArr.shift();
      } else if (modelsArr.length == 0 && brandsArr.length == 0) {
        const dataDir = "data";
        const dataDirLength = fs.readdirSync(dataDir).length;
        const dataFileName = `data/data${dataDirLength}.json`;
        fs.writeFileSync(dataFileName, JSON.stringify(data), err => {
          if (err) throw err;
        });

        const convDir = "conversations";
        const convDirLength = fs.readdirSync(convDir).length;
        const convFileName = `conversations/conv${convDirLength}.json`;
        fs.writeFileSync(convFileName, JSON.stringify(conv), err => {
          if (err) throw err;
        });

        conv.push({
          message: "Great, these details have been saved"
        });
      }
    }

    res.json(conv);
  });
};

module.exports = {
  messageController,
  conv
};
