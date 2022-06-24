// server/index.js

const express = require("express");
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3001;

const app = express();
const jsonParser = bodyParser.json()

const users = [];
const tweets = [];

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
app.use("/connexion", connexionRoutes);
app.use("/tweets", tweetsRoutes);
app.use("/user", userRoutes);

module.exports = app;

// app.get("/api", (req, res) => {
//     res.json({ message: "Hello from server!" });
//   });

// app.post('/signUp', jsonParser, (req, res) => {
//   const user = {
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     email: req.body.email,
//     password: req.body.password
//   };
//   if (users.some(e => e.email == user.email)) {
//     res.json({message: "Email already taken", state: 400});
//   } else { 
//     users.push(user);
//     res.status(200).json({message: "Sign in with Success", state: 200});
//   }
// }); 

// app.post('/checkID', jsonParser, (req, res) => {
//   const user = users.find(e => e.email == req.body.email);
//   if (user) {
//     user.password == req.body.password ?
//       res.status(200).json({message: "Log in with Success", firstName: user.firstName, lastName: user.lastName, state: 200}) :
//       res.json({message: "Bad password", state: 401});
//   } else {
//     res.json({message: "Email doesn't exist", state: 400});
//   }
// });

// app.post('/postTweet', jsonParser, (req, res) => {
//   const tweet = {
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     content: req.body.content,
//     id: req.body.id
//   };
//   tweets.push(tweet);
//   console.log(tweets);
//   res.status(200).json({message: "Tweet saved"});
// });

// app.get('/getTweets', jsonParser, (req, res) => {
//   res.json(tweets);
// })

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});