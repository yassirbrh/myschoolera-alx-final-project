const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    gradeLevel: {
        type: String,
        required: [true, "Please specify the grade level !!"]
    },
    gradeClass: {
        type: Number,
        required: [true, "Please specify the grade class !!"]
    },
    studentsList: {
        type: [String],
        required: true
    },
    teachersList: {
        type: mongoose.Schema.Types.Mixed,
        required: false
    },
    examScores: {
        type: mongoose.Schema.Types.Mixed,
        required: false
    }
});

const Class = mongoose.model('Class', classSchema);
module.exports = Class;
