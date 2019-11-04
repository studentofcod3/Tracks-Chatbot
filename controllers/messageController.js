const bodyParser = require("body-parser");

let urlencodedParser = bodyParser.urlencoded({ extended: true });

let conv = [
  {
    message: "hello, what's your name?"
  }
];

let data = {
  name: "",
  numOfTrucks: "",
  brands: [
    {
      brand: "volvo",
      models: [
        { model: "rx24", num: "2", engineSize: "3litres", axles: "2" },
        { model: "444", num: "3", engineSize: "4litres", axles: "5" }
      ]
    }
  ],
  monoBrand: true,
  multiBrand: false
};

let models = { model0: "vr 2210", model1: "rx 5200" };

let brand;
let model;
let num;
let engineSize;
let axles;

// data.brands[0].brand
// data.brands[0].models
//data.brands[0].models[0]  //first model
// data.brands[0].models[0].model //first model model
// data.brands[0].models[0].engineSize //first model engine size
//data.brands[0].models[1] second model

const messageController = app => {
  app.get("/", urlencodedParser, (req, res) => {
    res.render("message", { messages: conv });
  });

  app.post("/", urlencodedParser, (req, res) => {
    conv.push(req.body);

    // Testing multiple model structure
    // console.log(Object.values(models));
    // modelsArr = Object.values(models);
    // for (let i = 0; i < modelsArr.length; i++) {
    //   const element = array[i];

    // }

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
        if (req.body.answer == "yes") {
          conv.push({ message: "How many trucks do you own?" });
        } else if (req.body.answer == "no") {
          conv.push({ message: "When you get some trucks, let us know!" });
        } else {
          conv.push({
            message: "Sorry I don't understand. Do you own trucks?"
          });
        }
      }
    }

    // Ask if Monobrand or Multiple Brands
    if (
      conv.filter(e => e.message === "How many trucks do you own?").length > 0
    ) {
      if (
        !conv.filter(e => e.message === "Are they the same brand?").length > 0
      ) {
        if (conv[conv.length - 1].message !== "How many trucks do you own?") {
          data.numOfTrucks = req.body.answer;
          conv.push({ message: "Are they the same brand?" });
        }
      }
    }

    // Path division based on brands
    if (conv.filter(e => e.message === "Are they the same brand?").length > 0) {
      if (conv[conv.length - 2].message == "Are they the same brand?") {
        if (req.body.answer == "yes") {
          data.monoBrand = true;
          conv.push({ message: "Which brand do you have?" });
        } else if (req.body.answer == "no") {
          data.monoBrand = false;
          data.multiBrand = true;
          conv.push({ message: "What brands are they?" });
        }
      }
    }

    // SINGULAR BRAND
    if (conv[conv.length - 2].message == "Which brand do you have?") {
      brand = req.body.answer;
      conv.push({
        message: `Are the ${brand} trucks of the same model?`
      });
    }

    // @TODO ASSIGN VARYING BRANDS ROUTE

    // Singular Model
    if (
      conv[conv.length - 2].message ==
      `Are the ${brand} trucks of the same model?`
    ) {
      if (conv[conv.length - 1].answer == "yes") {
        conv.push({
          message: "Which model are they?"
        });
      }
    }

    // Multiple Models
    if (
      conv[conv.length - 2].message ==
      `Are the ${brand} trucks of the same model?`
    ) {
      if (conv[conv.length - 1].answer == "no") {
        conv.push({
          message: "Which models are they?"
        });
      }
    }

    if (conv[conv.length - 2].message == `Which models are they?`) {
      const answer = req.body.answer;
      const answerKey = answer.replace(" and ", " ");
      const answerSplit = answerKey.split(" ");
      // @TODO ASSIGN VARYING MODEL ROUTES
      for (let i = 0; i < answerSplit.length; i++) {
        models["model" + i] = answerSplit[i];
      }
      console.group(models);

      conv.push({ message: `How many ${models[0]} trucks do you have?` });
    }

    // Engine size
    if (conv[conv.length - 2].message == "Which model are they?") {
      model = req.body.answer;
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

    // How many of this particular truck
    if (conv[conv.length - 2].message == "How many axles do they have?") {
      axles = req.body.answer;
      conv.push({
        message: "How many of this particular truck do you have?"
      });
    }

    // Confirmation
    if (
      conv[conv.length - 2].message ==
      "How many of this particular truck do you have?"
    ) {
      num = req.body.answer;
      data.brands.push({
        brand,
        models: [{ model, num, engineSize, axles }]
      });

      conv.push({
        message:
          "Great, these details have been saved. Do you have more trucks to add?"
      });
    }

    res.json(conv);
  });
};

module.exports = {
  messageController,
  conv
};
