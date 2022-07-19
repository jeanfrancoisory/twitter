const Conversation = require("../models/Conversation");

exports.postMessage = (req, res) => {
    Conversation.findOne({users: {$all: [req.body.sender, req.body.recipient]}})
        .then((conv) => {
            if (conv) {
                Conversation.updateOne({_id: conv._id}, {$push: {messages: {
                    content: req.body.content,
                    date: Date.now(),
                    from: req.body.sender
                }}})
                    .then(() => res.status(201).json({message: "Message sent"}))
                    .catch(() => res.status(400).json({error: "Error updating Conversation"}));
            } else {
                const newConv = new Conversation({
                    users: [req.body.sender, req.body.recipient],
                    messages: [{
                        content: req.body.content,
                        date: Date.now(),
                        from: req.body.sender
                    }]
                });
                newConv.save()
                    .then(() => res.status(201).json({message: "Message sent"}))
            }
        })
}

exports.getConvsUser = (req, res) => {
    Conversation.find({users: {$elemMatch: {$eq: req.params.userID}}})
        .then((convs) => convs ? res.status(201).json(convs) : res.status(201).json({message: "No conversations"}))
        .catch(() => res.status(400).json({error: "Error getting Conversations"}));
}