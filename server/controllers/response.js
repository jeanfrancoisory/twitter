const Response = require("../models/Response");
const Tweet = require("../models/Tweet");

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
                    res.status(201).json(tl);
                })
                .catch(() => res.status(400).json({message: "Error getting Tweets"}));
            } else {
                res.status(201).json({message: "No responses"});
            }
            
        })
        .catch(() => res.status(400).json({message: "Error geting tweet's responses"}));
}

exports.postResponse = (req, res) => {
    Tweet.findOne({_id: req.body.tweetID})
        .then((t) => {
            Tweet.findOne({_id: req.body.responseID})
                .then((response) => {
                    t.responses.push(response._id);
                    const newTweet = new Tweet({
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
                    Tweet.updateOne({_id: t._id}, newTweet)
                        .then(() => res.status(201).json({message: "Response saved"}))
                        .catch(() => res.status(400).json({error: "Error saving response"}));
                })
                .catch(() => res.status(400).json({error: "Error getting response"}));
        })
        .catch(() => res.status(400).json({error: "Error getting tweet"}));
}