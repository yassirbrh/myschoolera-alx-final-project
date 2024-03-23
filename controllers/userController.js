import Teacher from '../models/teacherModel';
import Student from '../models/studentModel';
const asyncHandler = require('express-async-handler');

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const { userName, birthDate, position, photo } = req.body;

    if (!firstName || !lastName || !email || !password || !userName || !birthDate) {
        res.status(400);
        throw new Error("Please fill in all required fields !!");
    }
    const studentEmailExists = await Student.findOne({ email });
    const teacherEmailExists = await Teacher.findOne({ email });
    if (studentEmailExists || teacherEmailExists) {
        res.status(400);
        throw new Error("Email has already been registered");
    }
    const studentUsernameExists = await Student.findOne({ userName });
    const teacherUsernameExists = await Teacher.findOne({ userName });
    if (studentUsernameExists || teacherUsernameExists) {
        res.status(400);
        throw new Error("Username has already been registered");
    }
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must be up to 6 characters");
    }
    if (position !== 'teacher' && position !== 'student') {
        res.status(400);
        throw new Error("Please fill in the position field (Teacher or Student only) !!");
    } else if (position === 'teacher') {
        const { schoolSubject } = req.body;
        if (!schoolSubject) {
            res.status(400);
            throw new Error("Please fill in the school subject field !!");
        }
        const user = await Teacher.create({
            firstName, lastName, userName, email,
            password, birthDate, photo, schoolSubject
        });
        if (user) {
            const { _id, firstName, lastName, userName, email, birthDate, schoolSubject } = user;
            res.status(201).json({
                _id, firstName, lastName, userName, email, birthDate, schoolSubject
            });
        } else {
            res.status(400);
            throw new Error("Invalid user data");
        }
    } else if (position === 'student') {
        const { gradeLevel } = req.body;
        if (!gradeLevel) {
            res.status(400);
            throw new Error("Please fill in the grade level field !!");
        }
        const user = await Student.create({
            firstName, lastName, userName, email,
            password, birthDate, gradeLevel
        });
        if (user) {
            const { _id, firstName, lastName, userName, email, birthDate, gradeLevel } = user;
            res.status(201).json({
                _id, firstName, lastName, userName, email, birthDate, gradeLevel
            });
        } else {
            res.status(400);
            throw new Error("Invalid user data");
        }
    }

});

module.exports = { registerUser };