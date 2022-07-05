const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const auth = require("../middlewares/auth");
const mul = require("../middlewares/multer");

router.get("/getUser/:userID", auth, userCtrl.getUser);
router.get("/getUserByUN/:userName", auth, userCtrl.getUserByUN);
router.put("/updateUser", auth, userCtrl.updateUser);
router.post("/postImgUser", auth, mul.upload.single("image"), userCtrl.addImage);

module.exports = router;