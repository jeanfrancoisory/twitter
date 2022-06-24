const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const userTweetsSchema = Schema({
    author: {type: Schema.Types.ObjectId, ref: 'User', unique: true},
    tweets : [{type: Schema.Types.ObjectId, ref: 'Tweet'}]
});

userTweetsSchema.plugin(uniqueValidator);
module.exports = mongoose.model("UserTweets", userTweetsSchema);