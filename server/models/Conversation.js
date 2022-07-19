const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = Schema({
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    messages: [{
        content: {type: String},
        date: {type: Number},
        from: {type: Schema.Types.ObjectId, ref: 'User'}
    }]
});

module.exports = mongoose.model("Conversation", conversationSchema);