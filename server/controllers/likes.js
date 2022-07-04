const Tweet = require("../models/Tweet");
const User = require("../models/User");
const UserTweets = require('../models/UserTweets');

// TODO : use UpadtaeOne

exports.addLike = (req, res) => {
    Tweet.findOne({_id: req.body.tweetID})
        .then((t) => {
            User.findOne({_id: req.body.userID})
                .then((user) => {
                    UserTweets.findOne({user: req.body.userID})
                        .then((ut) => {
                            if (ut) {
                                 if (ut.favs.includes(t._id)) {
                                     res.status(201).json({message: "Tweet already liked"});
                                 } else {
                                     ut.favs.push(t._id);
                                const newUserTweets = new UserTweets({
                                    _id: ut._id,
                                    user: ut.user,
                                    tweets: ut.tweets,
                                    favs: ut.favs,
                                    retweets: ut.retweets
                                });
                                UserTweets.updateOne({_id: ut._id}, newUserTweets)
                                    .then(() => {
                                        t.favoris++;
                                        t.favorisUsers.push(user._id);
                                        const tweet = new Tweet({
                                            _id: t._id,
                                            content: t.content,
                                            date: t.date,
                                            favoris: t.favoris,
                                            retweets: t.retweets,
                                            author: t.author,
                                            responses: t.responses,
                                            isAnswerTo: t.isAnswerTo,
                                            favorisUsers: t.favorisUsers,
                                            retweetsUsers: t.retweetsUsers
                                        });
                                        Tweet.updateOne({_id: t._id}, tweet)
                                            .then(() => res.status(201).json({message: "Tweet liked"}))
                                            .catch(() => res.status(400).json({message: "Error updating Tweet's fav"}));
                                    })
                                    .catch(() => res.status(400).json({message: "Error updating UserTweets"}));
                                 }
                            } else {
                                const newUserTweets = new UserTweets({
                                    user: req.body.userID,
                                    favs: [t._id]
                                });
                                newUserTweets.save()
                                    .then(() => {
                                        t.favoris++;
                                        t.favorisUsers.push(user._id);
                                        const tweet = new Tweet({
                                            _id: t._id,
                                            content: t.content,
                                            date: t.date,
                                            favoris: t.favoris,
                                            retweets: t.retweets,
                                            author: t.author,
                                            responses: t.responses,
                                            isAnswerTo: t.isAnswerTo,
                                            favorisUsers: t.favorisUsers,
                                            retweetsUsers: t.retweetsUsers
                                        });
                                        Tweet.updateOne({_id: t._id}, tweet)
                                            .then(() => res.status(201).json({message: "Tweet liked"}))
                                            .catch(() => res.status(400).json({message: "Error updating Tweet's fav"}));})
                                    .catch(() => res.status(400).json({message: "Error saving new UserTweets"}));
                            }
                        })
                        .catch(() => res.status(400).json({message: "Error UserTweets"}));
                })
                .catch(() => res.status(400).json({message: "Error getting User"}));
            
        })
        .catch(() => res.status(400).json({message: "Error getting tweet"}));
}

exports.supprLike = (req, res) => {
    UserTweets.findOne({user: req.params.userID})
        .then((ut) => {
            if (ut) {
                const index = ut.favs.indexOf(ut.favs.find(e => e.toString() === req.params.tweetID));
                if (index != -1) {
                    ut.favs.splice(index, 1);
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
                                    const index = t.favorisUsers.indexOf(t.favorisUsers.find(e => e.toString() === req.params.userID));
                                    index!==-1 && t.favorisUsers.splice(index, 1);
                                    t.favoris--;
                                    const tweet = new Tweet({
                                        _id: t._id,
                                        content: t.content,
                                        date: t.date,
                                        favoris: t.favoris,
                                        retweets: t.retweets,
                                        author: t.author,
                                        responses: t.responses,
                                        isAnswerTo: t.isAnswerTo,
                                        favorisUsers: t.favorisUsers,
                                        retweetsUsers: t.retweetsUsers
                                    });
                                    Tweet.updateOne({_id: t._id}, tweet)
                                        .then(() => res.status(201).json({message: "Tweet disliked"}))
                                        .catch(() => res.status(400).json({message: "Error updating Tweet's fav"}));
                                })
                                .catch(() => res.status(400).json({message: "Error getting tweet"}));
                        })
                        .catch(() =>{
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

exports.getUserLikesByID = (req, res) => {
    UserTweets.findOne({user: req.params.userID})
        .populate("favs")
        .then((ut) => {
            if (ut) {
                const tl = [];
                ut.favs.forEach((t) => {
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

exports.getUserLikesByUN = (req, res) => {
    User.findOne({userName: req.params.userName})
        .then((u) => {
            UserTweets.findOne({user: u._id})
                .populate("favs")
                .then((ut) => {
                    if (ut) {
                        const tl = [];
                        ut.favs.forEach((t) => {
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
        .catch(() => res.status(400).json({error: "Error getting user"}));
}