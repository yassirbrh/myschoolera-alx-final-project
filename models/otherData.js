const mongoose = require('mongoose');

const otherDataSchema = new mongoose.Schema({
    adminPassword: {
        type: String,
        required: false,
        default: 'admin'
    },
    numberOfClassesInGrades: {
        type: mongoose.Schema.Types.Mixed,
        default: () => {
            const defaultValues = {};
            for (let i = 1; i <= 12; i++) {
                defaultValues[i.toString()] = 0;
            }
            return defaultValues;
        }
    }
});

const OtherData = mongoose.model('OtherData', otherDataSchema);
module.exports = OtherData;