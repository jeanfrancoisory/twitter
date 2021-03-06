// server/index.js

const express = require("express");
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3001;

const app = express();
const jsonParser = bodyParser.json()

mongoose
  .connect('mongodb://localhost:27017/twitter')
  .then(() => {
    console.log("Successfully connect to the database");
  })
  .catch((err) => {
    console.log("The server cannot connect to the database "+err);
    process.exit();
  });

app.use(jsonParser);

const connexionRoutes = require("./routes/connexion");
const tweetsRoutes = require("./routes/tweets");
const userRoutes = require("./routes/user");
const likesRoutes = require("./routes/likes");
const retweetsRoutes = require("./routes/retweets");
const responsesRoutes = require("./routes/response");
const subscriptionRoutes = require("./routes/subscription");
const conversationsRoutes = require("./routes/conversation");
app.use("/connexion", connexionRoutes);
app.use("/tweets", tweetsRoutes);
app.use("/user", userRoutes);
app.use("/likes", likesRoutes);
app.use("/retweets", retweetsRoutes);
app.use("/responses", responsesRoutes);
app.use("/subscription", subscriptionRoutes);
app.use("/conversations", conversationsRoutes);

module.exports = app;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});