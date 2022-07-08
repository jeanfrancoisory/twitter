const Tweet = require("../models/Tweet");
const User = require("../models/User");
const UserTweets = require("../models/UserTweets");

exports.getTweetResponses = (req, res) => {
    Tweet.findOne({_id: req.params.tweetID})
        .then((tweet) => {
            if (tweet) {
                Tweet.find({
                    _id : {
                        $in: tweet.responses
                    }
                })
                .populate("author")
                .then((tl) => {
                    tl ?
                    res.status(201).json(tl) : 
                    res.status(201).json({message: "No responses"});
                })
                .catch(() => res.status(400).json({message: "Error getting Tweets"}));
            } else {
                res.status(400).json({error: "No such tweet"});
            }
            
        })
        .catch(() => res.status(400).json({message: "Error geting tweet's responses"}));
}

exports.postResponse = (req, res) => {
    User.findOne({_id: req.body._id})
        .then((user) => {
            const tweet = new Tweet({
                content: req.body.content,
                date: req.body.date,
                author: user._id,
                isAnswerTo: req.body.tweetID
            })
            tweet.save()
                .then((response) => {
                    Tweet.updateOne({_id: req.body.tweetID}, {$push: {responses: response._id}})
                        .then(() => {
                            UserTweets.findOne({user: user._id})
                                .then((ut) => {
                                    if(ut) {
                                        UserTweets.updateOne({_id: ut._id}, {$push: {tweets: response._id}})
                                            .then(() => res.status(201).json({...response._doc, 
                                                firstName: user.firstName, 
                                                lastName: user.lastName, 
                                                userID: user._id,
                                                userName: user.userName,
                                                profilPicture: user.profilImage.data ? 'data:'+user.profilImage.contentType+';base64, '+user.profilImage.data : null}))
                                            .catch(() => res.status(400).json({ error: "Error updating userTweets" }));
                                    }else {
                                        const userTweets = new UserTweets({
                                            user: user._id,
                                            tweets: [response._id]
                                        });
                                        userTweets.save()
                                            .then(() => res.status(201).json({...response._doc, 
                                                firstName: user.firstName, 
                                                lastName: user.lastName, 
                                                userID: user._id,
                                                userName: user.userName,
                                                profilPicture: user.profilImage.data ? 'data:'+user.profilImage.contentType+';base64, '+user.profilImage.data : null}))
                                            .catch(() => res.status(400).json({ error: "Error creating userTweets" }));
                                    }
                                })
                                .catch(() => res.status(400).json({ error: "Error UserTweets" }));
                        })
                        .catch(() => res.status(400).json({error: "Error updating response parent"}));
                })
                .catch(() => res.status(400).json({ error: "Error while saving tweet"}));
        })
        .catch(() => res.status(400).json({ error: "User doesn't exist" }));
}

exports.getUserResponses = (req, res) => {
}