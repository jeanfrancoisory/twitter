const Tweet = require("../models/Tweet");
const User = require("../models/User");
const UserRetweets = require('../models/UserRetweets');

exports.addRetweet = (req, res) => {
    Tweet.findOne({_id: req.body.tweetID})
        .then((t) => {
            User.findOne({_id: req.body.userID})
                .then(() => {
                    UserRetweets.findOne({user: req.body.userID})
                        .then((ur) => {
                            if (ur) {
                                 if (ur.tweets.includes(t._id)) {
                                     res.status(201).json({message: "Tweet already retweeted"});
                                 } else {
                                     ur.tweets.push(t._id);
                                const newUserRetweets = new UserRetweets({
                                    _id: ur._id,
                                    user: ur.user,
                                    tweets: ur.tweets
                                });
                                UserRetweets.updateOne({_id: ur._id}, newUserRetweets)
                                    .then(() => {
                                        t.retweets++;
                                        const tweet = new Tweet({
                                            _id: t._id,
                                            content: t.content,
                                            favoris: t.favoris,
                                            retweets: t.retweets,
                                            author: t.author
                                        });
                                        Tweet.updateOne({_id: t._id}, tweet)
                                            .then(() => res.status(201).json({message: "Tweet retweeted"}))
                                            .catch(() => res.status(400).json({message: "Error updating Tweet's retweets"}));
                                    })
                                    .catch(() => res.status(400).json({message: "Error updating UserRetweets"}));
                                 }
                            } else {
                                const newUserRetweets = new UserRetweets({
                                    user: req.body.userID,
                                    tweets: [t._id]
                                });
                                newUserRetweets.save()
                                    .then(() => {
                                        t.retweets++;
                                        const tweet = new Tweet({
                                            _id: t._id,
                                            content: t.content,
                                            favoris: t.favoris,
                                            retweets: t.retweets,
                                            author: t.author
                                        });
                                        Tweet.updateOne({_id: t._id}, tweet)
                                            .then(() => res.status(201).json({message: "Tweet retweeted"}))
                                            .catch(() => res.status(400).json({message: "Error updating Tweet's retweet"}));})
                                    .catch(() => res.status(400).json({message: "Error saving new UserRetweets"}));
                            }
                        })
                        .catch(() => res.status(400).json({message: "Error UserRetweets"}));
                })
                .catch(() => res.status(400).json({message: "Error getting User"}));
            
        })
        .catch(() => res.status(400).json({message: "Error getting tweet"}));
}

exports.supprRetweet = (req, res) => {
    UserRetweets.findOne({user: req.params.userID})
        .then((ur) => {
            if (ur) {
                const index = ur.tweets.indexOf(ur.tweets.find(e => e.toString() === req.params.tweetID));
                if (index != -1) {
                    ur.tweets.splice(index, 1);
                    const newUserRetweets = new UserRetweets({
                        _id: ur._id,
                        user: ur.user,
                        tweets: ur.tweets
                    });
                    UserRetweets.updateOne({_id: ur._id}, newUserRetweets)
                        .then(() => {
                            Tweet.findOne({_id: req.params.tweetID})
                                .then((t) => {
                                    t.retweets--;
                                    const tweet = new Tweet({
                                        _id: t._id,
                                        content: t.content,
                                        date: t.date,
                                        favoris: t.favoris,
                                        retweets: t.retweets,
                                        author: t.author
                                    });
                                    Tweet.updateOne({_id: t._id}, tweet)
                                        .then(() => res.status(201).json({message: "Tweet disretweeted"}))
                                        .catch(() => res.status(400).json({message: "Error updating Tweet's retweet"}));
                                })
                                .catch(() => res.status(400).json({message: "Error getting tweet"}));
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
            res.status(400).json({ error: "Error UserRetweets" })
        );
}

exports.getUserRetweetsByID = (req, res) => {
    User.findOne({_id: req.params.userID})
        .then((u) => {
            UserRetweets.findOne({user: u._id})
                .populate("tweets")
                .then((ut) => {
                    if (ut) {
                        const tl = [];
                        ut.tweets.forEach((t) => {
                            tl.push(t._id);
                        });
                        Tweet.find({
                            _id: {
                                $in : tl
                            }
                        })
                            .populate("author")
                            .then((tweetslist) => {
                                res.status(201).json(tweetslist);
                            })
                            .catch(() => res.status(400).json({message: "Error in finding the tweets"}))
                    } else {
                        res.status(201).json({message: "No Tweets"});
                    }
                })
                .catch((error) =>
                    res.status(400).json({ error: "Error UserReTweets" })
                );
        })
        .catch(() => res.status(400).json({message: "Error getting User"}));
}

exports.getUserRetweetsByUN = (req, res) => {
    User.findOne({userName: req.params.userName})
        .then((u) => {
            UserRetweets.findOne({user: u._id})
                .populate("tweets")
                .then((ut) => {
                    if (ut) {
                        const tl = [];
                        ut.tweets.forEach((t) => {
                            tl.push(t._id);
                        });
                        Tweet.find({
                            _id: {
                                $in : tl
                            }
                        })
                            .populate("author")
                            .then((tweetslist) => {
                                res.status(201).json(tweetslist);
                            })
                            .catch(() => res.status(400).json({message: "Error in finding the tweets"}))
                    } else {
                        res.status(201).json({message: "No Tweets"});
                    }
                })
                .catch((error) =>
                    res.status(400).json({ error: "Error UserRetweets" })
                );
        })
        .catch(() => res.status(400).json({message: "Error getting User"}));
}

exports.getAllRetweets = (req, res) => {
    UserRetweets.find()
        .populate("user")
        .then((ur) => {
            if (ur) {
                const userRT = [];
                const tweetsRT = [];
                ur.forEach((element) => {
                    element.tweets.forEach((e) => {
                        tweetsRT.push(e._id);
                        userRT.push(element.user)
                    });
                });
                Tweet.find({
                    _id: {
                        $in : tweetsRT
                    }
                })
                    .populate("author")
                    .then((tweetslist) => {
                        res.status(201).json({
                            tl: tweetslist,
                            ids: tweetsRT,
                            users: userRT
                        });
                    })
                    .catch(() => res.status(400).json({message: "Error in finding the tweets"}))
            }
        })
        .catch((error) => {
            res.status(400).json({
              error: "Error in getting all retweets"
            });
        });
}