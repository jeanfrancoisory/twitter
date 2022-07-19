const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const userSubsSchema = Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', unique: true},
    subscriptions: [{type: Schema.Types.ObjectId, ref: 'User'}],
    followers: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

userSubsSchema.plugin(uniqueValidator);
module.exports = mongoose.model("UserSubs", userSubsSchema);