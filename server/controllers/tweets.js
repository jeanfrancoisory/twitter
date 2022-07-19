const Tweet = require("../models/Tweet");
const User = require("../models/User");
const UserTweets = require('../models/UserTweets');
const UserSubs = require("../models/UserSubs");
const fs = require("fs");

exports.postTweet = (req, res) => {
    User.findOne({_id: req.body._id})
        .then((user) => {
            const tweet = new Tweet({
                content: req.body.content,
                date: req.body.date,
                author: user._id
            })
            tweet.save()
                .then((t) => {
                    UserTweets.findOne({user: user._id})
                        .then((ut) => {
                            if(ut) {
                                ut.tweets.push(t._id);
                                const newUserTweets = new UserTweets({
                                    _id: ut._id,
                                    user: ut.user,
                                    tweets: ut.tweets,
                                    favs: ut.favs,
                                    retweets: ut.retweets
                                });
                                UserTweets.updateOne({_id: ut._id}, newUserTweets)
                                    .then(() => res.status(201).json({...t._doc, 
                                        firstName: user.firstName, 
                                        lastName: user.lastName, 
                                        userID: user._id,
                                        userName: user.userName,
                                        profilPicture: user.profilImage.data ? 'data:'+user.profilImage.contentType+';base64, '+user.profilImage.data : null}))
                                    .catch((error) =>{
                                        res.status(400).json({ error: "Error updating userTweets" });
                                    });
                            }else {
                                const userTweets = new UserTweets({
                                    user: user._id,
                                    tweets: [t._id]
                                });
                                userTweets.save()
                                    .then(() => res.status(201).json({...t._doc, 
                                        firstName: user.firstName, 
                                        lastName: user.lastName, 
                                        userID: user._id,
                                        userName: user.userName,
                                        profilPicture: user.profilImage.data ? 'data:'+user.profilImage.contentType+';base64, '+user.profilImage.data : null}))
                                    .catch((error) =>{
                                        res.status(400).json({ error: "Error creating userTweets" });
                                    });
                            }
                        })
                        .catch((error) =>
                            res.status(400).json({ error: "Error UserTweets" })
                        );
                })
                .catch((error) =>
                    res.status(400).json({ error: "Error while saving tweet", e: error })
                );
        })
        .catch((error) =>
            res.status(400).json({ error: "User doesn't exist" })
        );
}

exports.addImageTweet = (req, res) => {
    const img = fs.readFileSync(req.file.path);
    const encode_img = img.toString('base64');
    Tweet.findOne({_id: req.params.tweetID})
        .then((tweet) => {
            const newTweet = new Tweet({
                _id: tweet._id,
                content: tweet.content,
                date: tweet.date,
                author: tweet.author,
                favoris: tweet.favoris,
                retweets: tweet.retweets,
                responses: tweet.responses,
                isAnswerTo: tweet.isAnswerTo,
                favorisUsers: tweet.favorisUsers,
                retweetsUsers: tweet.retweetsUsers,
                tweetImage: {
                    data: encode_img,
                    contentType: req.file.mimetype
                }
            })
            Tweet.updateOne({_id: tweet._id}, newTweet)
                .then(() => res.status(201).json({tweetImage: {
                    data: encode_img,
                    contentType: req.file.mimetype
                }}))
                .catch(() => res.status(400).json({error: "Error updating tweet"}))
        })
        .catch(() => res.status(400).json({error: "Error fetching tweet"}));
}

exports.getAllTweets = (req, res) => {
    UserTweets.find()
        .populate("user")
        .populate("tweets")
        .then((userTweets) => res.status(201).json(userTweets))
        .catch((error) => {
            res.status(400).json({
              error: "Error in getting all tweets"
            });
        });
}

exports.getUserTweets = (req, res) => {
    User.findOne({userName: req.params.userName})
        .then((u) => {
            UserTweets.findOne({user: u._id})
                .populate("tweets")
                .populate("user")
                .then((ut) => {
                    if (ut) {
                        res.status(201).json(ut);
                    } else {
                        res.status(201).json({message: "No Tweets"});
                    }
                })
                .catch((error) =>
                    res.status(400).json({ error: "Error UserTweets" })
                );
        })
        .catch(() => res.status(400).json({message: "Error getting User"}));
    
}

exports.supprTweet = (req, res) => {
    Tweet.findOne({_id: req.params.tweetID})
        .then((tweet) => {
            UserTweets.findOne({author: req.params.userID})
                .then((ut) => {
                    if (ut) {
                        UserTweets.updateOne({_id: ut._id}, {$pullAll: {tweets: [{_id: req.params.tweetID}]}})
                            .then(() => {
                                UserTweets.updateMany({user: {$in: tweet.favorisUsers}}, {$pull: {favs: req.params.tweetID}})
                                    .then(() => {
                                        UserTweets.updateMany({user: {$in: tweet.retweetsUsers}}, {$pull: {retweets: req.params.tweetID}})
                                            .then(() => {
                                                Tweet.updateOne({responses: {$elemMatch: {$eq: req.params.tweetID}}}, {$pull: {responses: req.params.tweetID}})
                                                    .then(() => {
                                                        Tweet.deleteOne({_id: tweet._id})
                                                            .then(() => res.status(201).json({message: "Tweet deleted"}))
                                                            .catch(() => res.status(400).json({error: "Error deleting tweet"}));
                                                    })
                                                    .catch(() => res.status(400).json({error: "Error deleting tweet resposnes"}))
                                            })
                                            .catch(() => res.status(400).json({error : "Error updating RT"}));
                                    })
                                    .catch(() => res.status(400).json({error: " Error deleting favs"}));
                            })
                            .catch((error) =>{
                                res.status(400).json({ error: "Error deleting tweet from list" });
                            });
                    } else {
                        res.status(400).json({message: "Wrong user"});
                    }
                })
                .catch((error) =>
                    res.status(400).json({ error: "Error UserTweets" })
                );
        })
        .catch(() => res.status(400).json({message: "Error getting tweet"}));
}

exports.getAuthorTweet = (req, res) => {
    Tweet.findOne({_id: req.params.tweetID})
        .populate("author")
        .then((t) => {
            res.status(201).json({userName: t.author.userName});
        })
        .catch(() => res.status(400).json({error: "Error getting tweet"}));
}

exports.getOneTweet = (req, res) => {
    Tweet.findOne({_id: req.params.tweetID})
        .populate("author")
        .then((t) => t ? res.status(201).json(t) : res.status(201).json({message : "No Tweet"}))
        .catch(() => res.status(400).json({error: "Error getting tweetg"}));
}

exports.getUserTweetsSubs = (req, res) => {
    UserSubs.findOne({user: req.params.userID})
        .then((us) => {
            UserTweets.find({user: {
                $in: [...us.subscriptions, req.params.userID]
            }})
                .populate("user")
                .populate("tweets")
                .then((ut) => res.status(201).json(ut))
                .catch(() => res.status(400).json({error: "Error finding UserTweets"}));
        })
        .catch(() => res.status(400).json({error: "Error finding UserSubs"}));
}