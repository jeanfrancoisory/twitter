const express = require("express");
const router = express.Router();

const tweetCtrl = require("../controllers/tweets");
const auth = require("../AuthConfig/auth");

router.post("/postTweet", auth, tweetCtrl.postTweet);
router.get("/getAllTweets", tweetCtrl.getAllTweets);
router.get("/getUserTweets/:userName", auth, tweetCtrl.getUserTweets);
router.delete("/deleteUserTweet/:userID/:tweetID", auth, tweetCtrl.supprTweet);

module.exports = router;