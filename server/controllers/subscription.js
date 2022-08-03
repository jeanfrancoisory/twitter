const UserSubs = require("../models/UserSubs");

exports.subscribe = (req, res) => {
    function addFollow() {
        UserSubs.findOne({user: req.body.followID})
            .then((us2) => {
                if (us2) {
                    UserSubs.updateOne({user: req.body.followID}, {$push: {followers: req.body.userID}})
                        .then(() => res.status(201).json({message: "Subscription added"}))
                        .catch(() => res.status(400).json({error: "Error adding follower"}));
                } else {
                    const newUS2 = new UserSubs({
                        user: req.body.followID,
                        followers: [req.body.userID],
                        subscriptions: []
                    });
                    newUS2.save()
                        .then(() => res.status(201).json({message: "Subscription added"}))
                        .catch(() => res.status(400).json({error: "Error adding follower, saving new US"}));
                }
            })
            .catch(()=> res.status(400).json({error: "Error finding follow"}))
    }
    UserSubs.findOne({user: req.body.userID})
        .then((us1) => {
            if (us1) {
                UserSubs.updateOne({user: req.body.userID}, {$push: {subscriptions: req.body.followID}})
                    .then(() => addFollow())
                    .catch(() => res.status(400).json({error: "Error adding subscription"}));
            }
            else {
                const newUS1 = new UserSubs({
                    user: req.body.userID,
                    subscriptions: [req.body.followID],
                    followers: []
                });
                newUS1.save()
                    .then(() => addFollow())
                    .catch(() => res.status(400).json({error: "Error adding subscription, saving new US"}))
            }
        })
        .catch(() => res.status(400).json({error: "Error finding subscription"}));
}

exports.unsubscribe = (req, res) => {
    UserSubs.updateOne({user: req.params.userID}, {$pull: {subscriptions: req.params.followID}})
        .then(() => {
            UserSubs.updateOne({user: req.params.followID}, {$pull: {followers: req.params.userID}})
                .then(() => res.status(201).json({message: "Subscription deleted"}))
                .catch(() => res.status(400).json({error: "Error deleting follower"}));
        })
        .catch(() => res.status(400).json({error: "Error deleting subscription"}));
}

exports.getUserSubscritions = (req, res) => {
    UserSubs.findOne({user: req.params.userID})
        .then((userSubs) => userSubs ? res.status(201).json(userSubs.subscriptions) : res.status(201).json({message: "No subscriptions"}))
        .catch(() => res.status(400).json({error: "Error getting User Subscriptions"}));
}

exports.getUserNumberSub = (req, res) => {
    UserSubs.findOne({user: req.params.userID})
        .then((userSubs) => userSubs ? res.status(201).json(userSubs.subscriptions.length) : res.status(201).json({message: "No subscriptions"}))
        .catch(() => res.status(400).json({error: "Error getting User Subscriptions"}));
}

exports.getUserNumberFollow = (req, res) => {
    UserSubs.findOne({user: req.params.userID})
        .then((userSubs) => userSubs ? res.status(201).json(userSubs.followers.length) : res.status(201).json({message: "No subscriptions"}))
        .catch(() => res.status(400).json({error: "Error getting User Subscriptions"}));
}

exports.getUserSub = (req, res) => {
    UserSubs.findOne({user: req.params.userID})
        .populate('subscriptions')
        .then((userSubs) => userSubs ? res.status(201).json(userSubs.subscriptions) : res.status(201).json({message: "No subscriptions"}))
        .catch(() => res.status(400).json({error: "Error getting User Subscriptions"}));
}

exports.getUserFollow = (req, res) => {
    UserSubs.findOne({user: req.params.userID})
        .populate('followers')
        .then((userSubs) => userSubs ? res.status(201).json(userSubs.followers) : res.status(201).json({message: "No subscriptions"}))
        .catch(() => res.status(400).json({error: "Error getting User Subscriptions"}));
}
