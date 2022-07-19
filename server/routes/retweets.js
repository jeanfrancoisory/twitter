const express = require("express");
const router = express.Router();

const retweetCtrl = require("../controllers/retweets");
const auth = require("../middlewares/auth");

router.post("/postRTTweet", auth, retweetCtrl.addRetweet);
router.delete("/deleteRTTweet/:userID/:tweetID", auth, retweetCtrl.supprRetweet);
router.get("/getUserRTByID/:userID", auth, retweetCtrl.getUserRTByID);
router.get("/getUserRTByUN/:userName", auth, retweetCtrl.getUserRTByUN);
router.get("/getAllRetweets", retweetCtrl.getAllRetweets);
router.get("/getUserRTSubs/:userID", auth, retweetCtrl.getUserRTSubs);

module.exports = router;