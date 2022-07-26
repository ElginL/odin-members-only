const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullname: { 
        type: String, 
        required: true, 
        minlength: 5, 
        maxlength: 30 
    },
    username: { 
        type: String, 
        required: true, 
        minlength: 5, 
        maxlength: 20 
    },
    password: { 
        type: String, 
        required: true 
    },
    isMember: { 
        type: Boolean, 
        required: true 
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('User', UserSchema);