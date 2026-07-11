window.UMSCalculator = {
  calculateSemesterGPA: (courses) => {
    let totalPointsEarned = 0;
    let totalGpaHours = 0;

    courses.forEach((course) => {
      if (window.UMS_PASS_GRADES.includes(course.grade)) return;
      if (course.grade && course.points !== null) {
        totalPointsEarned += course.points * course.hours;
        totalGpaHours += course.hours;
      }
    });

    const gpa = totalGpaHours > 0 ? totalPointsEarned / totalGpaHours : 0;
    return Math.round(gpa * 1000) / 1000;
  },

  calculateCGPA: (uniqueCoursesMap) => {
    let totalPointsEarned = 0;
    let totalGpaHours = 0;

    uniqueCoursesMap.forEach((course) => {
      if (window.UMS_PASS_GRADES.includes(course.grade)) return;
      if (course.grade && course.points !== null) {
        totalPointsEarned += course.points * course.hours;
        totalGpaHours += course.hours;
      }
    });

    const cgpa = totalGpaHours > 0 ? totalPointsEarned / totalGpaHours : 0;
    return Math.round(cgpa * 1000) / 1000;
  },
};
