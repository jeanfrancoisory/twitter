const User = require("../models/User");
const e = require("express");

exports.getUser = (req, res) => {
    User.findOne({_id: req.params.userID})
        .then((u) => {
            res.status(201).json(u);
        })
        .catch(() => res.status(400).json({message: "Error getting user"}));
}