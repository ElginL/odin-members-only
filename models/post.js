const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const { DateTime } = require('luxon');

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 30
    },
    text: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 60
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    emoji: {
        type: String,
        required: true,
        enum: ["angry", "bigsmile", "cry", "grinning", "laugh", "lookup", "sad", "smileysweat"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

PostSchema
    .virtual('createdAtFormatted')
    .get(function() {
        return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED) + ", " +
            DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.TIME_24_SIMPLE)
    })

module.exports = mongoose.model('Post', PostSchema);