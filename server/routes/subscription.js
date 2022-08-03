const express = require("express");

const router = express.Router();
const auth = require("../middlewares/auth");
const subscriptionCtrl = require("../controllers/subscription");

router.post("/postSubscription", auth, subscriptionCtrl.subscribe);
router.delete("/deleteSubscription/:userID/:followID", auth, subscriptionCtrl.unsubscribe);
router.get("/getUserSubscriptions/:userID", auth, subscriptionCtrl.getUserSubscritions);
router.get("/getUserNumberSub/:userID", auth, subscriptionCtrl.getUserNumberSub);
router.get("/getUserNumberFollow/:userID", auth, subscriptionCtrl.getUserNumberFollow);
router.get("/getUserSub/:userID", auth, subscriptionCtrl.getUserSub);
router.get("/getUserFollow/:userID", auth, subscriptionCtrl.getUserFollow);

module.exports = router;
