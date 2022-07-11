const express = require("express");
const router = express.Router();

const tweetCtrl = require("../controllers/tweets");
const auth = require("../middlewares/auth");
const mul = require("../middlewares/multer");

router.post("/postTweet", auth, tweetCtrl.postTweet);
router.get("/getAllTweets", tweetCtrl.getAllTweets);
router.get("/getUserTweets/:userName", auth, tweetCtrl.getUserTweets);
router.delete("/deleteUserTweet/:userID/:tweetID", auth, tweetCtrl.supprTweet);
router.get("/getAuthorTweet/:tweetID", auth, tweetCtrl.getAuthorTweet);
router.get("/getOneTweet/:tweetID", auth, tweetCtrl.getOneTweet);
router.post("/addImageTweet/:tweetID", auth, mul.uploadTweet.single("imageTweet"), tweetCtrl.addImageTweet);

module.exports = router;