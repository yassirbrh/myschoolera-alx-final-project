const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    teacherUsername: {
        type: String,
        required: true
    },
    gradeLevel: {
        type: String,
        required: true
    },
    gradeClass: {
        type: Number,
        required: true
    }
});

const File = mongoose.model('File', fileSchema);
module.exports = File;
