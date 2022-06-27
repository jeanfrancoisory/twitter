const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetSchema = Schema({
    content: {type: String, default: ''},
    date: {type: Number},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    favoris: {type: Number, default: 0},
    retweets: {type: Number, default: 0}
});

module.exports = mongoose.model("Tweet", tweetSchema);