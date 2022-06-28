const express = require("express");
const router = express.Router();

const responseCtrl = require("../controllers/response");
const auth = require("../AuthConfig/auth");

router.get("/getTweetResponses/:tweetID", auth, responseCtrl.getTweetResponses);
router.post("/postResponse", auth, responseCtrl.postResponse);

module.exports = router;