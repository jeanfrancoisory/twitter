const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const responseSchema = Schema({
    tweet: {type: Schema.Types.ObjectId, ref: 'Tweet', unique: true},
    responseTweets : [{type: Schema.Types.ObjectId, ref: 'Tweet'}]
});

module.exports = mongoose.model("Response", responseSchema);