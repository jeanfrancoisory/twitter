const Tweet = require("../models/Tweet");
const User = require("../models/User");
const UserTweets = require('../models/UserTweets');
const UserFavs = require("../models/UserFavs");
const UserRetweets = require("../models/UserRetweets");
const e = require("express");

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
                    UserTweets.findOne({author: user._id})
                        .then((ut) => {
                            if(ut) {
                                ut.tweets.push(t._id);
                                const newUserTweets = new UserTweets({
                                    _id: ut._id,
                                    author: ut.author,
                                    tweets: ut.tweets
                                });
                                UserTweets.updateOne({_id: ut._id}, newUserTweets)
                                    .then(() => res.status(201).json({...t._doc, firstName: user.firstName, lastName: user.lastName, userID: user._id}))
                                    .catch((error) =>{
                                        res.status(400).json({ error: "Error updating userTweets" });
                                    });
                            }else {
                                const userTweets = new UserTweets({
                                    author: user._id,
                                    tweets: [t._id]
                                });
                                userTweets.save()
                                    .then(() => res.status(201).json({...t._doc, firstName: user.firstName, lastName: user.lastName, userID: user._id}))
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

exports.getAllTweets = (req, res) => {
    UserTweets.find()
        .populate("author")
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
            UserTweets.findOne({author: u._id})
                .populate("tweets")
                .populate("author")
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
                        const index = ut.tweets.indexOf(ut.tweets.find(e => e.toString() === req.params.tweetID));
                        if (index != -1) {
                            ut.tweets.splice(index, 1);
                            const newUserTweets = new UserTweets({
                                _id: ut._id,
                                author: ut.author,
                                tweets: ut.tweets
                            });
                            UserTweets.updateOne({_id: ut._id}, newUserTweets)
                                .then(() => {
                                    tweet.favoris!==0 ?
                                    UserFavs.findOne({user: req.params.userID})
                                        .then((uf) => {
                                            const index = uf.tweets.indexOf(uf.tweets.find(e => e.toString() === req.params.tweetID));
                                            index && uf.tweets.splice(index, 1);
                                            const newUserFavs = new UserFavs({
                                                _id: uf._id,
                                                user: uf.user,
                                                tweets: uf.tweets
                                            });
                                            UserFavs.updateOne({_id: uf._id}, newUserFavs)
                                                .then(() => {
                                                    tweet.retweets!==0 ? 
                                                    UserRetweets.findOne({_id: req.params.userID})
                                                        .then((ur) => {
                                                            const index = ur.tweets.indexOf(ur.tweets.find(e => e.toString() === req.params.tweetID));
                                                            index && ur.tweets.splice(index, 1);
                                                            const newUserRT = new UserRetweets({
                                                                _id: uf._id,
                                                                user: uf.user,
                                                                tweets: uf.tweets
                                                            });
                                                            UserRetweets.updateOne({_id: ur._id}, newUserRT)
                                                                .then(() => {
                                                                    Tweet.deleteOne({_id: req.params.tweetID})
                                                                        .then(() => res.status(201).json({message: "Tweet deleted"}))
                                                                        .catch(() => res.status(400).json({message: "Error deleting tweet"}));
                                                                })
                                                                .catch(() => res.status(400).json({error: "Error Updating UserRetweets"}));
                                                        }).catch(() => res.status(400).json({error: "Error UserRetweets"})) :
                                                        Tweet.deleteOne({_id: req.params.tweetID})
                                                            .then(() => res.status(201).json({message: "Tweet deleted"}))
                                                            .catch(() => res.status(400).json({message: "Error deleting tweet"}));  
                                                })
                                                .catch(() => res.status(400).json({error: "Error Updating UserFavs"}));                                          
                                        }).catch(() => res.status(400).json({error: "Error UserFavs"})) :
                                        tweet.retweets!==0 ? 
                                        UserRetweets.findOne({_id: req.params.userID})
                                            .then((ur) => {
                                                const index = ur.tweets.indexOf(ur.tweets.find(e => e.toString() === req.params.tweetID));
                                                index && ur.tweets.splice(index, 1);
                                                const newUserRT = new UserRetweets({
                                                    _id: uf._id,
                                                    user: uf.user,
                                                    tweets: uf.tweets
                                                });
                                                UserRetweets.updateOne({_id: ur._id}, newUserRT)
                                                    .then(() => {
                                                        Tweet.deleteOne({_id: req.params.tweetID})
                                                            .then(() => res.status(201).json({message: "Tweet deleted"}))
                                                            .catch(() => res.status(400).json({message: "Error deleting tweet"}));
                                                    })
                                                    .catch(() => res.status(400).json({error: "Error Updating UserRetweets"}))
                                            }).catch(() => res.status(400).json({error: "Error UserRetweets"})) :
                                            Tweet.deleteOne({_id: req.params.tweetID})
                                                .then(() => res.status(201).json({message: "Tweet deleted"}))
                                                .catch(() => res.status(400).json({message: "Error deleting tweet"}));
                                })
                                .catch((error) =>{
                                    res.status(400).json({ error: "Error deleting tweet from list" });
                                });
                        } else {
                            res.status(400).json({message: "Tweet doesn't exist"});
                        }
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

