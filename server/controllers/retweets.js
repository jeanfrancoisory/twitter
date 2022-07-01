const Tweet = require("../models/Tweet");
const User = require("../models/User");
const UserTweets = require('../models/UserTweets');

// TODO : use UpadtaeOne

exports.addRetweet = (req, res) => {
    Tweet.findOne({_id: req.body.tweetID})
        .then((t) => {
            User.findOne({_id: req.body.userID})
                .then((user) => {
                    UserTweets.findOne({user: req.body.userID})
                        .then((ut) => {
                            if (ut) {
                                 if (ut.retweets.includes(t._id)) {
                                     res.status(201).json({message: "Tweet already retweeted"});
                                 } else {
                                     ut.retweets.push(t._id);
                                const newUserTweets = new UserTweets({
                                    _id: ut._id,
                                    user: ut.user,
                                    tweets: ut.tweets,
                                    favs: ut.favs,
                                    retweets: ut.retweets
                                });
                                UserTweets.updateOne({_id: ut._id}, newUserTweets)
                                    .then(() => {
                                        t.retweets++;
                                        t.retweetsUsers.push(user._id);
                                        const tweet = new Tweet({
                                            _id: t._id,
                                            content: t.content,
                                            favoris: t.favoris,
                                            retweets: t.retweets,
                                            author: t.author,
                                            responses: t.responses,
                                            favorisUsers: t.favorisUsers,
                                            retweetsUsers: t.retweetsUsers
                                        });
                                        Tweet.updateOne({_id: t._id}, tweet)
                                            .then(() => res.status(201).json({message: "Tweet retweeted"}))
                                            .catch(() => res.status(400).json({message: "Error updating Tweet's retweets"}));
                                    })
                                    .catch(() => res.status(400).json({message: "Error updating UserTweets"}));
                                 }
                            } else {
                                const newUserTweets = new UserTweets({
                                    user: req.body.userID,
                                    retweets: [t._id]
                                });
                                newUserTweets.save()
                                    .then(() => {
                                        t.retweets++;
                                        t.retweetsUsers.push(user._id);
                                        const tweet = new Tweet({
                                            _id: t._id,
                                            content: t.content,
                                            favoris: t.favoris,
                                            retweets: t.retweets,
                                            author: t.author,
                                            responses: t.responses,
                                            favorisUsers: t.favorisUsers,
                                            retweetsUsers: t.retweetsUsers
                                        });
                                        Tweet.updateOne({_id: t._id}, tweet)
                                            .then(() => res.status(201).json({message: "Tweet retweeted"}))
                                            .catch(() => res.status(400).json({message: "Error updating Tweet's retweet"}));})
                                    .catch(() => res.status(400).json({message: "Error saving new UserTweets"}));
                            }
                        })
                        .catch(() => res.status(400).json({message: "Error UserTweets"}));
                })
                .catch(() => res.status(400).json({message: "Error getting User"}));
            
        })
        .catch(() => res.status(400).json({message: "Error getting tweet"}));
}

exports.supprRetweet = (req, res) => {
    UserTweets.findOne({user: req.params.userID})
        .then((ut) => {
            if (ut) {
                const index = ut.retweets.indexOf(ut.retweets.find(e => e.toString() === req.params.tweetID));
                if (index != -1) {
                    ut.retweets.splice(index, 1);
                    const newUserTweets = new UserTweets({
                        _id: ut._id,
                        user: ut.user,
                        tweets: ut.tweets,
                        favs: ut.favs,
                        retweets: ut.retweets
                    });
                    UserTweets.updateOne({_id: ut._id}, newUserTweets)
                        .then(() => {
                            Tweet.findOne({_id: req.params.tweetID})
                                .then((t) => {
                                    const index = t.retweetsUsers.indexOf(t.retweetsUsers.find(e => e.toString() === req.params.userID));
                                    index && t.retweetsUsers.splice(index, 1);
                                    t.retweets--;
                                    const tweet = new Tweet({
                                        _id: t._id,
                                        content: t.content,
                                        date: t.date,
                                        favoris: t.favoris,
                                        retweets: t.retweets,
                                        author: t.author,
                                        responses: t.responses,
                                        favorisUsers: t.favorisUsers,
                                        retweetsUsers: t.retweetsUsers
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
            res.status(400).json({ error: "Error UserTweets" })
        );
}

exports.getUserRTByID = (req, res) => {
    UserTweets.findOne({user: req.params.userID})
        .populate("retweets")
        .then((ut) => {
            if (ut) {
                const tl = [];
                ut.retweets.forEach((t) => {
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
            res.status(400).json({ error: "Error UserTweets" })
        );
}

exports.getUserRTByUN = (req, res) => {
    User.findOne({userName: req.params.userName})
        .then((u) => {
            UserTweets.findOne({user: u._id})
                .populate("retweets")
                .then((ut) => {
                    if (ut) {
                        const tl = [];
                        ut.retweets.forEach((t) => {
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
                    res.status(400).json({ error: "Error UserTweets" })
                );
        })
        .catch(() => res.status(400).json({error: "Error getting User"}));
}

exports.getAllRetweets = (req, res) => {
    UserTweets.find()
        .populate("user")
        .then((ut) => {
            if (ut) {
                const userRT = [];
                const tweetsRT = [];
                ut.forEach((element) => {
                    element.retweets.forEach((e) => {
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