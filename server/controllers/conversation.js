const Conversation = require("../models/Conversation");

exports.postMessage = (req, res) => {
    Conversation.findOne({users: {$all: [req.body.sender, req.body.recipient]}})
        .then((conv) => {
            if (conv) {
                Conversation.updateOne({_id: conv._id}, {$push: {messages: {
                    $each: [{
                        content: req.body.content,
                        date: Date.now(),
                        from: req.body.sender
                    }],
                    $sort: {date: -1}
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
        .populate("users")
        .then((convs) => {
            if(convs) {
                res.status(201).json(convs);
            }else{ 
                res.status(201).json({message: "No conversations"})
            }
        })
        .catch(() => res.status(400).json({error: "Error getting Conversations"}));
}

exports.getOneConv = (req, res) => {
    Conversation.findOne({users: {$all: [req.params.sender, req.params.recipient]}})
        .populate("users")
        .then((conversation) => res.status(201).json(conversation))
        .catch(() => res.status(400).json({error: "Error sending Converstation"}));   
}

exports.supprMessage = (req, res) => {
    Conversation.findOne({_id: req.params.conversationID})
        .then((conv) => {
            conv.messages[conv.messages.findIndex((m) => m._id==req.params.messageID)].content += ' '+Date.now()+' suppr';
            const newConv = new Conversation({
                _id: conv._id,
                users: conv.users,
                messages: conv.messages
            });
            Conversation.updateOne({_id: conv._id}, newConv)
                .then(() => res.status(201).json({message: "Message suppr"}))
                .catch(() => res.status(400).json({error: "Error deleting message"}));
        })
        .catch(() => res.status(400).json({error: "Error finding Conversation"}))
}