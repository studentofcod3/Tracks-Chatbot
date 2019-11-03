// if (data.length > 1) {
//   let name = messages.answer1;
//   let question = { message: `Hello ${name}, do you own trucks?` };
//   data.push(question);
// }

// name = messages.answer1
// numTrucks = messages.answer2
// brands = {messages.answer3 (parse to find which brands. split into substrings remove " and")}
// truck1 = brands.truck1
// truck2 = brands.truck2
// etc.

// if answer 5 false then question 6 is

// {
//   question1: `Hello ${name}, do you own trucks?`,
//   question2: "How many trucks do you have?",
//   question3: "What brand(s) are they?",
//   question4: `How many ${truck1} do you own?`,
//   question5: "Are they the same model?",
// }

// const { data } = require("../controllers/messageController");

// const questions = () => {
//   if (data.length == 2) {
//     data.push({ message: `Hi ${req.body.answer}, do you own trucks?` });
//   }
//   if (data.length == 4 && (req.body.answer !== "no" || "nein")) {
//     data.push({ message: "How many trucks do you own?" });
//   }

//   if (data.length == 6) {
//     data.push({ message: "Are they the same brand?" });
//   }

//   if (data.length == 8 && (req.body.answer !== "no" || "nein")) {
//     data.push({ message: "What brand is it?" });
//   } else {
//     data.push({ message: "What brands are they?" });
//   }
// };

// module.exports = {
//   questions
// };
