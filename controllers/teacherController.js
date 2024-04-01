import Class from '../models/classModel';
import File from '../models/fileModel';
const asyncHandler = require('express-async-handler');
import extractGradeInfo from '../utils/getGradeInfo';

const getGrades = asyncHandler(async (req, res) => {
    const teacherUsername = req.user.userName;
    const schoolSubject = req.user.schoolSubject;

    const foundClasses = await Class.find({ [`teachersList.${schoolSubject}`]: teacherUsername });


    const grades = {};
    foundClasses.forEach(foundClass => {
        const classKey = `Gr.${foundClass.gradeLevel}/${foundClass.gradeClass}`;
        grades[classKey] = {
            exam1: foundClass.examScores[schoolSubject]['exam1'],
            exam2: foundClass.examScores[schoolSubject]['exam2'],
            exam3: foundClass.examScores[schoolSubject]['exam3']
        };
    });

    if (Object.keys(grades).length > 0) {
        res.status(200).json(grades);
    } else {
        res.status(404).json({ message: 'No grades found for the teacher and subject' });
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
    const { classID, grades } = req.body;
    const { gradeLevel, gradeClass } = extractGradeInfo(classID);
    const schoolSubject = req.user.schoolSubject;
  
    let parsedGrades;
    try {
      parsedGrades = JSON.parse(grades);
    } catch (error) {
      res.status(400).json({ message: 'Invalid JSON data' });
      return;
    }
  
    const validSubjects = ['Mathematics', 'Science', 'English Language', 'History', 'Geography', 'Computer Science', 'Physical Education'];
    if (!validSubjects.includes(schoolSubject)) {
      res.status(400).json({ message: 'Invalid school subject' });
      return;
    }
  
    // Build update object
    const updateObject = {
      $set: {
        [`examScores.${schoolSubject}`]: parsedGrades, // Update nested object using computed property name
      },
    };
  
    try {
      const updatedClass = await Class.findOneAndUpdate(
        { gradeLevel, gradeClass },
        updateObject,
        { new: true } // Return the updated document
      );
  
      if (!updatedClass) {
        res.status(404).json({ message: 'Class not found' });
        return;
      }
  
      res.status(200).json({ message: 'Grades added successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error adding grades' });
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
