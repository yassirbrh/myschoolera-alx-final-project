export default function calculateAge(birthDate) {
    // Calculate the age based on the birthDate
    const today = new Date();
    const dob = new Date(birthDate);
    let age = today.getFullYear() - dob.getFullYear();
    const month = today.getMonth() - dob.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}
