const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userRetweetsSchema = Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', unique: true},
    tweets : [{type: Schema.Types.ObjectId, ref: 'Tweet'}]
});

module.exports = mongoose.model("UserRetweets", userRetweetsSchema);