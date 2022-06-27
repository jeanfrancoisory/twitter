const express = require("express");
const router = express.Router();

const likeCtrl = require("../controllers/likes");
const auth = require("../AuthConfig/auth");

router.post("/postLikeTweet", auth, likeCtrl.addLike);
router.delete("/deleteLikeTweet/:userID/:tweetID", auth, likeCtrl.supprLike);
router.get("/getUserLikesByID/:userID", auth, likeCtrl.getUserLikesByID);
router.get("/getUserLikesByUN/:userName", auth, likeCtrl.getUserLikesByUN);

module.exports = router;