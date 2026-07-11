(() => {
  const main = async () => {
    const semesters = window.parseUMSPage();
    if (!semesters || semesters.length === 0) return;
    const chronologicalSemesters = [...semesters].reverse();
    const uniqueAcademicHistoryMap = new Map();
    chronologicalSemesters.forEach((semester) => {
      const calculatedGPA = window.UMSCalculator.calculateSemesterGPA(
        semester.courses,
      );
      semester.courses.forEach((course) => {
        if (course.code) uniqueAcademicHistoryMap.set(course.code, course);
      });
      const calculatedCGPA = window.UMSCalculator.calculateCGPA(
        uniqueAcademicHistoryMap,
      );
      if (!semester.hasExistingGpa)
        window.UMSRenderer.renderSemesterGPA(
          semester.termElement,
          calculatedGPA,
        );
      window.UMSRenderer.renderCGPA(
        semester.roundElement,
        semester.heroElement,
        calculatedCGPA,
      );
    });
    await window.UMSUpdater.checkForUpdates();
  };
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", main);
  else main();
})();