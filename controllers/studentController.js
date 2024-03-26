import Class from '../models/classModel';
const asyncHandler = require('express-async-handler');

const getGrades = asyncHandler(async (req, res) => {
    const userUsername = req.user.userName;
    const foundClass = await Class.findOne({ studentsList: { $in: [userUsername] } });
    if (foundClass) {
        const grades = {};
        for (const subject in foundClass.examScores) {
            grades[subject]['exam1'] = foundClass.examScores[subject]['exam1'][userUsername];
            grades[subject]['exam2'] = foundClass.examScores[subject]['exam2'][userUsername];
            grades[subject]['exam3'] = foundClass.examScores[subject]['exam3'][userUsername];
        }
        res.status(200).json(grades);
    } else {
        res.status(404).json({ message: 'Class not found' });
    }
});

const getCourses = asyncHandler(async (req, res) => {
    const userUsername = req.user.userName;
    const { schoolSubject } = req.body;
    const foundClass = await Class.findOne({ studentsList: { $in: [userUsername] } });
    if (foundClass) {
        const teacherUsername = Object.keys(foundClass.teachersList).find(username => foundClass.teachersList[username] === schoolSubject);

        if (teacherUsername) {
            const files = await File.findMany({ classID: `Gr.${foundClass.gradeLevel}/${foundClass.gradeClass}`, teacherUsername});
            res.status(200).json(files);
        }
    }
    res.status(404).json({ message: 'Course not found' });
})

module.exports = { getGrades, getCourses };
