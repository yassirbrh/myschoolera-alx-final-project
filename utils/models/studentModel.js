import userSchema from "./userSchema";
import calculateAge from "../utils/calculateAge";

const studentSchema = userSchema.base({
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

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
