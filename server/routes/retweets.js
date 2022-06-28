const express = require("express");
const router = express.Router();

const retweetCtrl = require("../controllers/retweets");
const auth = require("../AuthConfig/auth");

router.post("/postRTTweet", auth, retweetCtrl.addRetweet);
router.delete("/deleteRTTweet/:userID/:tweetID", auth, retweetCtrl.supprRetweet);
router.get("/getUserRTByID/:userID", auth, retweetCtrl.getUserRetweetsByID);
router.get("/getUserRTByUN/:userName", auth, retweetCtrl.getUserRetweetsByUN);
router.get("/getAllRetweets", retweetCtrl.getAllRetweets);

module.exports = router;