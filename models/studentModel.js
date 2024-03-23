import userSchema from "./userSchema";
import calculateAge from "../utils/calculateAge";
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    ...userSchema.obj,
    gradeLevel: {
        type: String,
        required: [true, "Please specify the grade level !!"]
    },
    birthDate: {
        type: Date,
        required: [true, "Please enter your birth date."],
        validate: {
            validator: function(value) {
                const age = calculateAge(value);
                return age >= 6 && age <= 21;
            },
            message: "Students must be between 6 and 21 years old."
        }
    }
});

studentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcryptjs.genSalt(10);
    const hashPwd = await bcryptjs.hash(this.password, salt);
    this.password = hashPwd;
    next();
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
