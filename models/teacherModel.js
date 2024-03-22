import userSchema from "./userSchema";
import calculateAge from "../utils/calculateAge";

const teacherSchema = userSchema.base({
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

const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;
