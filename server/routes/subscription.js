const express = require("express");

const router = express.Router();
const auth = require("../middlewares/auth");
const subscritionCtrl = require("../controllers/subscription");

router.post("/postSubscription", auth, subscritionCtrl.subscribe);
router.delete("/deleteSubscription/:userID/:followID", auth, subscritionCtrl.unsubscribe);
router.get("/getUserSubscriptions/:userID", auth, subscritionCtrl.getUserSubscritions);

module.exports = router;