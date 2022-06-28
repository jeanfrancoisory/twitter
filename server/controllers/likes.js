const Tweet = require("../models/Tweet");
const User = require("../models/User");
const UserFavs = require('../models/UserFavs');

exports.addLike = (req, res) => {
    Tweet.findOne({_id: req.body.tweetID})
        .then((t) => {
            User.findOne({_id: req.body.userID})
                .then((user) => {
                    UserFavs.findOne({user: req.body.userID})
                        .then((uf) => {
                            if (uf) {
                                 if (uf.tweets.includes(t._id)) {
                                     res.status(201).json({message: "Tweet already liked"});
                                 } else {
                                     uf.tweets.push(t._id);
                                const newUserFavs = new UserFavs({
                                    _id: uf._id,
                                    user: uf.user,
                                    tweets: uf.tweets
                                });
                                UserFavs.updateOne({_id: uf._id}, newUserFavs)
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
                                            favorisUsers: t.favorisUsers,
                                            retweetsUsers: t.retweetsUsers
                                        });
                                        Tweet.updateOne({_id: t._id}, tweet)
                                            .then(() => res.status(201).json({message: "Tweet liked"}))
                                            .catch(() => res.status(400).json({message: "Error updating Tweet's fav"}));
                                    })
                                    .catch(() => res.status(400).json({message: "Error updating UserFavs"}));
                                 }
                            } else {
                                const newUserFavs = new UserFavs({
                                    user: req.body.userID,
                                    tweets: [t._id]
                                });
                                newUserFavs.save()
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
                                            favorisUsers: t.favorisUsers,
                                            retweetsUsers: t.retweetsUsers
                                        });
                                        Tweet.updateOne({_id: t._id}, tweet)
                                            .then(() => res.status(201).json({message: "Tweet liked"}))
                                            .catch(() => res.status(400).json({message: "Error updating Tweet's fav"}));})
                                    .catch(() => res.status(400).json({message: "Error saving new UserFavs"}));
                            }
                        })
                        .catch(() => res.status(400).json({message: "Error UserFavs"}));
                })
                .catch(() => res.status(400).json({message: "Error getting User"}));
            
        })
        .catch(() => res.status(400).json({message: "Error getting tweet"}));
}

exports.supprLike = (req, res) => {
    UserFavs.findOne({user: req.params.userID})
        .then((uf) => {
            if (uf) {
                const index = uf.tweets.indexOf(uf.tweets.find(e => e.toString() === req.params.tweetID));
                if (index != -1) {
                    uf.tweets.splice(index, 1);
                    const newUserFavs = new UserFavs({
                        _id: uf._id,
                        user: uf.user,
                        tweets: uf.tweets
                    });
                    UserFavs.updateOne({_id: uf._id}, newUserFavs)
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
                                        favorisUsers: t.favorisUsers,
                                        retweetsUsers: t.retweetsUsers
                                    });
                                    Tweet.updateOne({_id: t._id}, tweet)
                                        .then(() => res.status(201).json({message: "Tweet disliked"}))
                                        .catch(() => res.status(400).json({message: "Error updating Tweet's fav"}));
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

exports.getUserLikesByID = (req, res) => {
    User.findOne({_id: req.params.userID})
        .then((u) => {
            UserFavs.findOne({user: u._id})
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
                    res.status(400).json({ error: "Error UserTweets" })
                );
        })
        .catch(() => res.status(400).json({message: "Error getting User"}));
}

exports.getUserLikesByUN = (req, res) => {
    User.findOne({userName: req.params.userName})
        .then((u) => {
            UserFavs.findOne({user: u._id})
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
                    res.status(400).json({ error: "Error UserTweets" })
                );
        })
        .catch(() => res.status(400).json({message: "Error getting User"}));
}