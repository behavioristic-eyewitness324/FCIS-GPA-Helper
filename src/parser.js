window.parseUMSPage = () => {
  const structuredData = [];
  const yearElements = document.querySelectorAll(".ums-year");
  const dict = window.UMS_DICTIONARY;

  yearElements.forEach((yearEl) => {
    const yearTitle =
      yearEl.querySelector(".ums-year__header-title")?.innerText?.trim() || "";
    const roundElements = yearEl.querySelectorAll(".ums-round");

    roundElements.forEach((roundEl) => {
      const roundTitleEl = roundEl.querySelector(".ums-round__title");
      let roundName = "";
      if (roundTitleEl) {
        const spanEl = roundTitleEl.querySelector("span");
        roundName = spanEl
          ? spanEl.innerText.replace(/[·\s]/g, "").trim()
          : roundTitleEl.innerText.trim();
      }

      const heroElement = roundEl.querySelector(".ums-hero") || null;
      const termElements = roundEl.querySelectorAll(".ums-term");

      termElements.forEach((termEl) => {
        const termName =
          termEl.querySelector(".ums-term__name")?.innerText?.trim() || "";
        const hasGpaChip = !!termEl.querySelector(".ums-chip--gpa");
        const courseElements = termEl.querySelectorAll(".ums-course");

        const courses = Array.from(courseElements).reduce((acc, courseEl) => {
          const code =
            courseEl.querySelector(".ums-course__code")?.innerText?.trim() ||
            "";
          const name =
            courseEl.querySelector(".ums-course__title")?.innerText?.trim() ||
            code;

          let grade = null;
          let hours = 0;
          let points = null;
          let isExcuseCourse = false;

          const rows = courseEl.querySelectorAll(".ums-course__row");
          rows.forEach((row) => {
            const label = row
              .querySelector(".ums-course__row-label")
              ?.innerText?.trim();
            const value =
              row.querySelector(".ums-course__row-value")?.innerText?.trim() ||
              null;

            if (window.UMS_EXCUSES_SKIP.includes(value)) isExcuseCourse = true;
            if (label === dict.gradeLabel || label?.startsWith("Grade"))
              grade = value;
            else if (
              label === dict.hoursLabel ||
              label?.startsWith("Course Hours")
            )
              hours = Number(value) || 0;
            else if (label === dict.pointsLabel || label === "Points")
              points = value !== "" && value !== null ? Number(value) : null;
          });

          if (isExcuseCourse) return acc;

          if (
            points === null &&
            grade &&
            window.UMS_GRADE_MAP[grade] !== undefined
          )
            points = window.UMS_GRADE_MAP[grade];

          acc.push({ code, name, hours, grade, points });
          return acc;
        }, []);

        structuredData.push({
          year: yearTitle,
          round: roundName,
          term: termName,
          roundElement: roundEl,
          termElement: termEl,
          heroElement: heroElement,
          hasExistingGpa: hasGpaChip,
          courses,
        });
      });
    });
  });

  return structuredData;
};
