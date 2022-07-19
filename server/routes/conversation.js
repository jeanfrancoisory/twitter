const express = require("express");
const router = express.Router();

const conversationCtrl = require("../controllers/conversation");
const auth = require("../middlewares/auth");

router.post("/postMessage", auth, conversationCtrl.postMessage);
router.get("/getUserConvs/:userID", auth, conversationCtrl.getConvsUser);

module.exports = router;