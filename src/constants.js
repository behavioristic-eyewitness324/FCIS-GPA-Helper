window.UMS_GRADE_MAP = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  Fail: 0.0,
  راسب: 0.0,
};

window.UMS_PASS_GRADES = ["ناجح", "Pass"];
window.UMS_EXCUSES_SKIP = ["مرضى", "عذر", "موافقة القومسيون الطبى", "طبى"];
window.isArabicPage =
  document.body.innerText.includes("معدل النقاط") ||
  document.body.innerText.includes("التقدير") ||
  document.body.innerText.includes("الدرجات");

window.UMS_DICTIONARY = {
  get gradeLabel() {
    return window.isArabicPage ? "التقدير" : "Grade";
  },
  get hoursLabel() {
    return window.isArabicPage ? "ساعات المقرر" : "Course Hours";
  },
  get pointsLabel() {
    return window.isArabicPage ? "النقاط" : "Points";
  },
  get cumulativeGradeLabel() {
    return window.isArabicPage ? "التقدير تراكمي" : "Cumulative Grade";
  },
  get cgpaLabel() {
    return window.isArabicPage ? "معدل النقاط التراكمى" : "CGPA";
  },
  get semesterGpaLabel() {
    return "GPA";
  },
};

window.UMS_GRADE_THRESHOLDS = Object.entries(window.UMS_GRADE_MAP)
  .filter(([grade]) => grade !== "A" && grade !== "راسب")
  .map(([grade, min]) => ({ min, grade }))
  .sort((a, b) => b.min - a.min);

window.getGradeLetterFromGPA = (gpa) => {
  if (gpa == null || Number.isNaN(gpa)) return null;
  for (const { min, grade } of window.UMS_GRADE_THRESHOLDS)
    if (gpa >= min) return grade;
  return "Fail";
};
