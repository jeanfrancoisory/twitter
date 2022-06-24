const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const auth = require("../AuthConfig/auth");

router.get("/getUser/:userID", auth, userCtrl.getUser);
router.get("/getUserByUN/:userName", auth, userCtrl.getUserByUN);

module.exports = router;