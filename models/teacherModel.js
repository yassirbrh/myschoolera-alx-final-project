import userSchema from "./userSchema";
import calculateAge from "../utils/calculateAge";
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const teacherSchema = new mongoose.Schema({
    ...userSchema.obj,
    schoolSubject: {
        type: String,
        required: [true, "Please specify the school subject !!"]
    },
    birthDate: {
        type: Date,
        required: [true, "Please enter your birth date."],
        validate: {
            validator: function(value) {
                const age = calculateAge(value);
                return age >= 23 && age <= 65;
            },
            message: "Teachers must be between 23 and 65 years old."
        }
    }
});

teacherSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcryptjs.genSalt(10);
    const hashPwd = await bcryptjs.hash(this.password, salt);
    this.password = hashPwd;
    next();
});

const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;
