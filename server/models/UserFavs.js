const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userFavsSchema = Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', unique: true},
    tweets : [{type: Schema.Types.ObjectId, ref: 'Tweet'}]
});

module.exports = mongoose.model("UserFavs", userFavsSchema);