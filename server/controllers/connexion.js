const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.getWelcomeMessage = (req, res) => {
    res.json({ message: "Hello from server!" });
}

exports.postNewUser = (req, res) => {
    User.findOne({userName: req.body.userName})
        .then((u) => {
            if (u){
                res.json({message: "UserName already taken", state: 400});
            } else {
                bcrypt.hash(req.body.password, 10)
                    .then((hash) => {
                        const user = new User({
                            userName: req.body.userName,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(() => {
                                res.status(200).json({message: "Sign in with Success", state: 200});
                            })
                            .catch((error) =>
                                res.status(400).json({ error: "please complete all fields" })
                            );
                    })
                
            }
        })
        .catch((error) => res.status(500).json({ error }));
    }

exports.checkID = (req, res) => {
    User.findOne({email: req.body.email})
        .then((user) => {
            if(!user) {
                res.status(401).json({error: "Email doesn't exist"});
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then((valid) => {
                        if(!valid) {
                            res.status(401).json({error: "Bad password"});
                        } else {
                            res.status(200).json({message: "Log in with Success", 
                                                    userName: user.userName,
                                                    firstName: user.firstName, 
                                                    lastName: user.lastName, 
                                                    _id: user._id,
                                                    token: jwt.sign(
                                                        { _id: user._id },
                                                        'RANDOM_TOKEN_SECRET',
                                                        { expiresIn: '24h' }
                                                      )
                                                });
                        }
                    })
                    .catch((error) => res.status(500).json({ error }));
            }
        })
        .catch((error) => res.status(500).json({ error }));
}