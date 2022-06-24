const express = require("express");
const bodyParser = require('body-parser')
const router = express.Router();
const jsonParser = bodyParser.json()

const connexionCtrl = require("../controllers/connexion");

router.get("/api", connexionCtrl.getWelcomeMessage);
router.post("/signUp", connexionCtrl.postNewUser);
router.post("/checkID", connexionCtrl.checkID);

module.exports = router;