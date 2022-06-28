const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetSchema = Schema({
    content: {type: String, default: ''},
    date: {type: Number},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    favoris: {type: Number, default: 0},
    retweets: {type: Number, default: 0},
    responses: [{type: Schema.Types.ObjectId, ref: 'Tweet'}],
    favorisUsers: [{type: Schema.Types.ObjectId, ref: 'User'}],
    retweetsUsers: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model("Tweet", tweetSchema);