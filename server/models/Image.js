const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = Schema({
    data: {type: Buffer},
    contentType: {type: String}
});

module.exports = mongoose.model("Image", imageSchema);