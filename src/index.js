(() => {
  const main = async () => {
    const semesters = window.parseUMSPage();
    if (!semesters || semesters.length === 0) return;

    const hasUnpublished =
      window.UMSPredictionForm.detectUnpublishedSemesters(semesters);

    if (hasUnpublished)
      window.UMSPredictionForm.renderForm(
        semesters,
        (selectedGradesOverrides) =>
          runGPAWorkflow(semesters, selectedGradesOverrides),
      );

    runGPAWorkflow(semesters, null);
    await window.UMSUpdater.checkForUpdates();
  };

  const runGPAWorkflow = (semesters, gradeOverridesMap) => {
    const chronologicalSemesters = [...semesters].reverse();
    const uniqueAcademicHistoryMap = new Map();
    let breakCalculation = false;

    chronologicalSemesters.forEach((semester) => {
      if (semester.isUnpublished && gradeOverridesMap) {
        const originalSemIdx = semesters.indexOf(semester);
        semester.courses.forEach((course) => {
          const baseId = course.code || course.name.replace(/\s+/g, "_");
          const uniqueMapKey = `s${originalSemIdx}_${baseId}`;
          const predictedGrade = gradeOverridesMap.get(uniqueMapKey);
          if (predictedGrade) {
            course.grade = predictedGrade;
            course.points = window.UMS_GRADE_MAP[predictedGrade];
          }
        });
      }

      if (semester.isUnpublished && !gradeOverridesMap) breakCalculation = true;

      if (breakCalculation) return;
      const calculatedGPA = window.UMSCalculator.calculateSemesterGPA(
        semester.courses,
      );

      semester.courses.forEach((course) => {
        if (course.code) uniqueAcademicHistoryMap.set(course.code, course);
      });

      const calculatedCGPA = window.UMSCalculator.calculateCGPA(
        uniqueAcademicHistoryMap,
      );
      const existingHeroInDom =
        semester.roundElement.querySelector(".ums-hero");
      if (existingHeroInDom) semester.heroElement = existingHeroInDom;

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
  };

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", main);
  else main();
})();
