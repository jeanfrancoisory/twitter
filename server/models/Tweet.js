const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetSchema = Schema({
    content: {type: String, default: ''},
    date: {type: Number},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    favoris: {type: Number, default: 0},
    retweets: {type: Number, default: 0},
    responses: [{type: Schema.Types.ObjectId, ref: 'Tweet'}],
    isAnswerTo: {type: Schema.Types.ObjectId, ref: 'Tweet', default: null},
    favorisUsers: [{type: Schema.Types.ObjectId, ref: 'User'}],
    retweetsUsers: [{type: Schema.Types.ObjectId, ref: 'User'}],
    tweetImage: {
        data: {type: String},
        contentType: {type: String}
    }
});

module.exports = mongoose.model("Tweet", tweetSchema);