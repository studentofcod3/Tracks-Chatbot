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
  numOfTrucks: 0,
  monoBrand: true,
  multiBrand: false,
  brands: []
};

let modelsArr = [];
let brandsArr = [];

let brand;
let model;
let numModel;
let engineSize;
let axles;

let num;
let numBrand;

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
        ans == "yea" ||
        ans == "sure" ||
        ans == "indeed" ||
        ans == "of course" ||
        ans == "ofcourse" ||
        ans == "ofc" ||
        ans == "obviously" ||
        ans == "certainly" ||
        ans == "absolutely" ||
        ans == "affirmative" ||
        ans == "aye" ||
        ans == "yep" ||
        ans == "roger" ||
        ans == "uh-huh" ||
        ans == "surely" ||
        ans == "positive" ||
        ans == "most certainly" ||
        ans == "clearly"
      ) {
        conv.push({ message: "How many trucks do you own?" });
      } else if (
        ans == "no" ||
        ans == "n" ||
        ans == "nein" ||
        ans == "nah" ||
        ans == "nope" ||
        ans == "ne" ||
        ans == "by no means" ||
        ans == "not at all" ||
        ans == "negative" ||
        ans == "never" ||
        ans == "nae" ||
        ans == "naw" ||
        ans == "nay" ||
        ans == "absolutely not" ||
        ans == "most certainly not" ||
        ans == "ofcourse not" ||
        ans == "of course not" ||
        ans == "ofc not" ||
        ans == "obviously not" ||
        ans == "under no circumstances" ||
        ans == "clearly not"
      ) {
        conv.push({ message: "When you get some trucks, let us know!" });
      } else {
        conv.push({
          message: "Sorry I don't understand. Do you own trucks?"
        });
      }
    }

    // Ask if Monobrand or Multiple Brands
    if (conv[conv.length - 2].message == "How many trucks do you own?") {
      data.numOfTrucks = req.body.answer;
      num = req.body.answer;

      if (num == 1) {
        conv.push({ message: "Which brand do you have?" });
        numModel = 1;
        numBrand = 1;
      } else if (data.numOfTrucks == 0) {
        conv.push({ message: "When you get some trucks, let us know!" });
      } else {
        conv.push({ message: "Are they the same brand?" });
      }
    }

    // Path division based on brands
    if (
      conv[conv.length - 2].message == "Are they the same brand?" ||
      conv[conv.length - 2].message ==
        "Sorry I don't understand. Are they the same brand?"
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
        ans == "yea" ||
        ans == "sure" ||
        ans == "indeed" ||
        ans == "of course" ||
        ans == "ofcourse" ||
        ans == "ofc" ||
        ans == "obviously" ||
        ans == "certainly" ||
        ans == "absolutely" ||
        ans == "affirmative" ||
        ans == "aye" ||
        ans == "yep" ||
        ans == "roger" ||
        ans == "uh-huh" ||
        ans == "surely" ||
        ans == "positive" ||
        ans == "most certainly" ||
        ans == "clearly"
      ) {
        data.monoBrand = true;
        numBrand = num;
        conv.push({ message: "Which brand do you have?" });
      } else if (
        ans == "no" ||
        ans == "n" ||
        ans == "nein" ||
        ans == "nah" ||
        ans == "nope" ||
        ans == "ne" ||
        ans == "by no means" ||
        ans == "not at all" ||
        ans == "negative" ||
        ans == "never" ||
        ans == "nae" ||
        ans == "naw" ||
        ans == "nay" ||
        ans == "absolutely not" ||
        ans == "most certainly not" ||
        ans == "ofcourse not" ||
        ans == "of course not" ||
        ans == "ofc not" ||
        ans == "obviously not" ||
        ans == "under no circumstances" ||
        ans == "clearly not"
      ) {
        data.monoBrand = false;
        data.multiBrand = true;
        conv.push({ message: "What brands are they?" });
      } else {
        conv.push({
          message: "Sorry I don't understand. Are they the same brand?"
        });
      }
    }

    // SINGULAR BRAND
    if (conv[conv.length - 2].message == "Which brand do you have?") {
      brand = req.body.answer;
      if (num == 1 || numBrand == 1) {
        conv.push({ message: "Which model is it?" });
      }
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
        if (num == 2) {
          conv.push({
            message: `Which model is the ${brand} truck?`
          });
        } else if (num > 2) {
          conv.push({ message: `How many ${brand} trucks do you have?` });
        }
        brandsArr.shift();
      }
    }

    if (
      conv[conv.length - 2].message == `How many ${brand} trucks do you have?`
    ) {
      const ans = conv[conv.length - 1].answer;
      numBrand = ans;

      if (numBrand == 1) {
        conv.push({ message: "Which model is it?" });
        numModel = 1;
      } else if (num == 1) {
        conv.push({ message: `Which model is the ${brand} truck?` });
      } else {
        conv.push({
          message: `Are the ${brand} trucks of the same model?`
        });
      }
    }

    // Models question
    if (
      conv[conv.length - 2].message ==
        `Are the ${brand} trucks of the same model?` ||
      conv[conv.length - 2].message ==
        `Sorry I don't understand. Are the ${brand} trucks of the same model?`
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
        ans == "yea" ||
        ans == "sure" ||
        ans == "indeed" ||
        ans == "of course" ||
        ans == "ofcourse" ||
        ans == "ofc" ||
        ans == "obviously" ||
        ans == "certainly" ||
        ans == "absolutely" ||
        ans == "affirmative" ||
        ans == "aye" ||
        ans == "yep" ||
        ans == "roger" ||
        ans == "uh-huh" ||
        ans == "surely" ||
        ans == "positive" ||
        ans == "most certainly" ||
        ans == "clearly"
      ) {
        conv.push({
          message: "Which model are they?"
        });
        numModel = numBrand;
      } else if (
        ans == "no" ||
        ans == "n" ||
        ans == "nein" ||
        ans == "nah" ||
        ans == "nope" ||
        ans == "ne" ||
        ans == "by no means" ||
        ans == "not at all" ||
        ans == "negative" ||
        ans == "never" ||
        ans == "nae" ||
        ans == "naw" ||
        ans == "nay" ||
        ans == "absolutely not" ||
        ans == "most certainly not" ||
        ans == "ofcourse not" ||
        ans == "of course not" ||
        ans == "ofc not" ||
        ans == "obviously not" ||
        ans == "under no circumstances" ||
        ans == "clearly not"
      ) {
        conv.push({
          message: "Which models are they?"
        });
      } else {
        conv.push({
          message: `Sorry I don't understand. Are the ${brand} trucks of the same model?`
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
      conv[conv.length - 2].message ==
        `How many ${model} trucks do you have?` ||
      conv[conv.length - 2].message == "Which model is it?" ||
      conv[conv.length - 2].message == `Which model is the ${brand} truck?`
    ) {
      let prevQues = conv[conv.length - 2].message;
      if (
        prevQues == "Which model are they?" ||
        prevQues == "Which model is it?" ||
        prevQues == `Which model is the ${brand} truck?`
      ) {
        model = req.body.answer;
      } else if (prevQues == `How many ${model} trucks do you have?`) {
        numModel = req.body.answer;
      }

      if (
        prevQues == "Which model is it?" ||
        prevQues == `Which model is the ${brand} truck?`
      ) {
        numModel = 1;
      }

      conv.push({
        message: "What is the engine size?"
      });
    }

    // Number of axles
    if (
      conv[conv.length - 2].message == "What is the engine size?" ||
      conv[conv.length - 2].message ==
        `What is the ${model} truck's engine size?`
    ) {
      engineSize = req.body.answer;
      if (data.numOfTrucks == 1 || numBrand == 1 || numModel == 1 || num == 1) {
        conv.push({
          message: "How many axles does it have?"
        });
      } else {
        conv.push({
          message: "How many axles do they have?"
        });
      }
    }

    // Save
    if (
      conv[conv.length - 2].message == "How many axles do they have?" ||
      conv[conv.length - 2].message == "How many axles does it have?"
    ) {
      axles = req.body.answer;
      num = num - numModel;

      data.brands.push({
        truck: [{ brand, model, numModel, engineSize, axles }]
      });

      if (modelsArr.length > 0) {
        model = modelsArr[0];
        numBrand = numBrand - numModel;
        if (num == 1 || numModel == 1 || numBrand == 1) {
          conv.push({ message: `What is the ${model} truck's engine size?` });
        } else {
          conv.push({ message: `How many ${model} trucks do you have?` });
        }
        model = modelsArr[0];
        modelsArr.shift();
      } else if (brandsArr.length > 0) {
        brand = brandsArr[0];
        if (num == 1) {
          conv.push({ message: `Which model is the ${brand} truck?` });
        } else {
          conv.push({ message: `How many ${brand} trucks do you have?` });
        }
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
