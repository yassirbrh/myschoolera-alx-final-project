const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "You must enter a first name !!"]
    },
    lastName: {
        type: String,
        required: [true, "You must enter a last name !!"]
    },
    userName: {
        type: String,
        required: [true, "Please you must choose a username !!"],
        unique: true,
        trim: true,
        match: [/^[a-zA-Z0-9_-]{3,16}$/, "Invalid username !!"]
    },
    email: {
        type: String,
        required: [true, "Please enter an email !!"],
        unique: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address !!"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password !!"]
    },
    birthDate: {
        type: Date,
        required: [true, "Please enter your birth date !!"],
    },
    photo: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    isAccepted: {
        type: Boolean,
        default: false
    }
});

module.exports = userSchema;