import Student from '../models/studentModel';
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const authStudentProtect = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            throw new Error('Not authorized, please login !!');
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const student = await Student.findById(verified.id).select("-password -__v -isAccepted");

        if (student) {
            req.user = student._doc;
        } else {
            throw new Error('Only students Authorized !!');
        }
        next();
    } catch(error) {
        res.status(401);
        throw new Error(error.message);
    }
});

module.exports = authStudentProtect;
