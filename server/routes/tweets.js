const express = require("express");
const router = express.Router();

const tweetCtrl = require("../controllers/tweets");
const auth = require("../AuthConfig/auth");

router.post("/postTweet", auth, tweetCtrl.postTweet);
router.get("/getTweets", tweetCtrl.getAllTweets);
router.get("/getUserTweets/:userID", auth, tweetCtrl.getUserTweets);
router.delete("/deleteUserTweet/:userID/:tweetID", auth, tweetCtrl.supprTweet);
router.post("/postLikeTweet", auth, tweetCtrl.addLike);
router.delete("/deleteLikeTweet/:userID/:tweetID", auth, tweetCtrl.supprLike);
router.get("/getUserLikes/:userID", auth, tweetCtrl.getUserLikes);

module.exports = router;