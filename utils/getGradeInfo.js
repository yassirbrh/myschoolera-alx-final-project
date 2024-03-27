function extractGradeInfo(gradeString) {
    const regex = /^Gr\.(\d+)\/(\d+)$/;
    const match = gradeString.match(regex);
    if (match) {
        const gradeLevel = match[1];
        const gradeClass = parseInt(match[2]);
        return { gradeLevel, gradeClass };
    } else {
        throw new Error("Invalid grade string format");
    }
}

module.exports = extractGradeInfo;