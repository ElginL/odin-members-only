const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 5
    },
    text: {
        type: String,
        required: true,
        minlength: 10
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    timestamp: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Post', PostSchema);