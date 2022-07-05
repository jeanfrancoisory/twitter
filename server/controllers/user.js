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
    console.log(req);
    const img = fs.readFileSync(req.file.path);
    const encode_img = img.toString('base64');
    const finalImg = new Image({
        data: Buffer.from(encode_img, 'base64'),
        contentType: req.file.mimetype
    })
    finalImg.save()
        .then(() => {
            res.status(201).json({message: "Image saves"});
        })
        .catch(() => res.status(400).json({error: "Error saving image"}));
}