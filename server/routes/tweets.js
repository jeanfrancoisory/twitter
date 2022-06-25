const express = require("express");
const router = express.Router();

const tweetCtrl = require("../controllers/tweets");
const auth = require("../AuthConfig/auth");

router.post("/postTweet", auth, tweetCtrl.postTweet);
router.get("/getTweets", tweetCtrl.getAllTweets);
router.get("/getUserTweets/:userName", auth, tweetCtrl.getUserTweets);
router.delete("/deleteUserTweet/:userID/:tweetID", auth, tweetCtrl.supprTweet);
router.post("/postLikeTweet", auth, tweetCtrl.addLike);
router.delete("/deleteLikeTweet/:userID/:tweetID", auth, tweetCtrl.supprLike);
router.get("/getUserLikesByID/:userID", auth, tweetCtrl.getUserLikesByID);
router.get("/getUserLikesByUN/:userName", auth, tweetCtrl.getUserLikesByUN);
module.exports = router;