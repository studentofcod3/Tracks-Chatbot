const express = require("express");
const { messageController } = require("./controllers/messageController");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("./public"));

messageController(app);

app.listen(3000);
