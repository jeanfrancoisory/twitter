const User = require("../models/User");
const Image = require("../models/Image");
const fs = require("fs");

exports.getUser = (req, res) => {
    User.findOne({_id: req.params.userID})
        .then((u) => {
            res.status(201).json(u);
        })
        .catch(() => res.status(400).json({message: "Error getting user"}));
}

exports.getUserByUN = (req, res) => {
    User.findOne({userName: req.params.userName})
        .then((u) => {
            res.status(201).json(u);
        })
        .catch(() => res.status(400).json({message: "Error getting user"}));
}

exports.updateUser = (req, res) => {
    User.updateOne({userName: req.body.userName}, {$set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }})
    .then(() => res.status(201).json({message: "User updated"}))
    .catch(() => res.status(400).json({error: "Error updating tweet"}));
}

exports.addImage = (req, res) => {
    const img = fs.readFileSync(req.file.path);
    const encode_img = img.toString('base64');
    User.findOne({userName: req.params.userName})
        .then((user) => {
            const newUser = new User({
                _id: user._id,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
                profilImage: {
                    data: encode_img,
                    contentType: req.file.mimetype
                }
            })
            User.updateOne({_id: user._id}, newUser)
                .then(() => res.status(201).json({profilImage: {
                    data: encode_img,
                    contentType: req.file.mimetype
                }}))
                .catch(() => res.status(400).json({error: "Error updating user"}))
        })
        .catch(() => res.status(400).json({error: "Error fetching user"}));
}