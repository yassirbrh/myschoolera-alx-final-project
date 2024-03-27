import Class from '../models/classModel';
import File from '../models/fileModel';
const asyncHandler = require('express-async-handler');
import extractGradeInfo from '../utils/getGradeInfo';

const getGrades = asyncHandler(async (req, res) => {
    const { classID, schoolSubject } = req.body;
    const { gradeLevel, gradeClass } = extractGradeInfo(classID);
    const foundClass = await Class.findOne({ gradeLevel, gradeClass });
    if (foundClass) {
        const grades = {};
        grades[schoolSubject]['exam1'] = foundClass.examScores[schoolSubject]['exam1'];
        grades[schoolSubject]['exam2'] = foundClass.examScores[schoolSubject]['exam2'];
        grades[schoolSubject]['exam3'] = foundClass.examScores[schoolSubject]['exam3'];
        res.status(200).json(grades);
    } else {
        res.status(404).json({ message: 'Class not found' });
    }
});

const getCourses = asyncHandler(async (req, res) => {
    const teacherUsername = req.user.userName;
    const { classID } = req.body;
    const files = await File.findMany({ teacherUsername, classID });
    if (files) {
        res.status(200).json(files);
    }
    res.status(404).json({ message: 'Course not found' });
});

const addGrades = asyncHandler(async (req, res) => {
    const { classID, schoolSubject, exam, grades } = req.body;
    const { gradeLevel, gradeClass } = extractGradeInfo(classID);

    const validSubjects = ['Mathematics', 'Science', 'English Language', 'History', 'Geography', 'Computer Science', 'Physical Education'];
    if (!validSubjects.includes(schoolSubject)) {
        res.status(400).json({ message: 'Invalid school subject' });
        return;
    }

    const foundClass = await Class.findOne({ gradeLevel, gradeClass });
    if (foundClass) {
        if (!['exam1', 'exam2', 'exam3'].includes(exam)) {
            res.status(400).json({ message: 'Invalid exam option' });
            return;
        }

        const students = Object.keys(grades);
        if (students.length === 0) {
            res.status(400).json({ message: 'No student grades provided' });
            return;
        }

        students.forEach(studentUsername => {
            foundClass.examScores[schoolSubject][exam][studentUsername] = grades[studentUsername];
        });

        await foundClass.save();

        res.status(200).json({ message: 'Grades added successfully' });
    } else {
        res.status(404).json({ message: 'Class not found' });
    }
});

const addFile = asyncHandler(async (req, res) => {
    const { classID, url, filename } = req.body;
    const teacherUsername = req.user.userName;
    const savedFile = await File.create({ teacherUsername, classID, url, filename });
    if (savedFile) {
        res.status(201).json(savedFile);
    } else {
        res.status(500).json({ message: 'Failed to save file' });
    }
});

module.exports = { getGrades, getCourses, addGrades, addFile };
