window.UMSPredictionForm = {
  detectUnpublishedSemesters: (semesters) => {
    let hasUnpublished = false;

    semesters.forEach((semester) => {
      const gpaCourses = semester.courses.filter(
        (course) =>
          course.hours > 0 &&
          course.code &&
          !window.UMS_PASS_GRADES.includes(course.grade),
      );
      const hasMissingGrade =
        gpaCourses.length > 0 &&
        gpaCourses.some((course) => course.points === null);

      if (hasMissingGrade) {
        semester.isUnpublished = true;
        semester.unpublishedCourses = gpaCourses.filter(
          (c) => c.points === null,
        );
        hasUnpublished = true;
      } else {
        semester.isUnpublished = false;
        semester.unpublishedCourses = [];
      }
    });

    return hasUnpublished;
  },

  renderForm: (semesters, onCalculateCallback) => {
    const yearsWrapper = document.querySelector(".container.ums-grades");
    if (!yearsWrapper) return;

    if (yearsWrapper.querySelector(".ums-prediction-card")) return;

    const isArabic = window.isArabicPage;
    const texts = {
      cardTitle: isArabic
        ? "توقع معدلك التراكمي (GPA Prediction)"
        : "GPA Prediction",
      message: isArabic
        ? "بعض المواد ليس لديها درجات منشورة حتى الآن. إذا كنت تعرف درجاتك بالفعل (أو تريد تقديرها)، حدد تقديرًا لكل مادة أدناه. تستخدم هذه القيم محليًا فقط ولا يتم إرسالها إلى أي مكان."
        : "Some courses do not have published grades yet. If you already know your grades (or want to estimate them), select a grade for each course below. These values are only used locally and are never sent anywhere.",
      selectPlaceholder: isArabic ? "اختر التقدير" : "Select Grade",
      btnCalculate: isArabic ? "احسب GPA" : "Calculate GPA",
    };

    const card = document.createElement("div");
    card.className = "card ums-prediction-card";
    Object.assign(card.style, {
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderTop: "5px solid #007bff",
      borderRadius: "8px",
      marginBottom: "24px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      fontFamily: "inherit",
      direction: isArabic ? "rtl" : "ltr",
      textAlign: isArabic ? "right" : "left",
    });

    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header";
    Object.assign(cardHeader.style, {
      padding: "16px 20px",
      borderBottom: "1px solid #e2e8f0",
    });
    cardHeader.innerHTML = `<h5 style="margin: 0; font-weight: 700; color: #1e3a8a; font-size: 1.15rem;">${texts.cardTitle}</h5>`;

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    Object.assign(cardBody.style, { padding: "20px" });

    const message = document.createElement("p");
    Object.assign(message.style, {
      margin: "0 0 20px 0",
      color: "#334155",
      fontSize: "0.95rem",
      lineHeight: "1.5",
    });
    message.innerText = texts.message;
    cardBody.appendChild(message);

    const form = document.createElement("form");
    form.id = "umsPredictionForm";

    let formClutterCount = 0;
    const gradeOptions = Object.keys(window.UMS_GRADE_MAP);

    semesters.forEach((semester, semIdx) => {
      if (!semester.isUnpublished) return;

      semester.unpublishedCourses.forEach((course) => {
        formClutterCount++;
        const row = document.createElement("div");
        Object.assign(row.style, {
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        });
        const baseId = course.code || course.name.replace(/\s+/g, "_");
        const inputId = `ums_override_s${semIdx}_${baseId}`;

        const label = document.createElement("label");
        label.setAttribute("for", inputId);
        Object.assign(label.style, {
          fontWeight: "600",
          color: "#475569",
          margin: "0",
          flex: "1 1 50%",
        });

        const semesterDisplay = semester.year
          ? `${semester.year} - ${semester.term || semester.round}`
          : `${semester.term || semester.round}`;

        label.innerText = course.code
          ? `${course.code}: ${course.name} (${semesterDisplay})`
          : `${course.name} (${semesterDisplay})`;

        const select = document.createElement("select");
        select.id = inputId;
        select.name = `s${semIdx}_${baseId}`;
        select.required = true;
        select.className = "custom-select";
        Object.assign(select.style, {
          padding: "8px 12px",
          border: "1px solid #cbd5e1",
          borderRadius: "6px",
          color: "#334155",
          fontSize: "0.9rem",
          flex: "0 1 auto",
          width: "160px",
        });

        const placeholderOption = document.createElement("option");
        placeholderOption.value = "";
        placeholderOption.innerText = texts.selectPlaceholder;
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        select.appendChild(placeholderOption);

        gradeOptions.forEach((gradeLetter) => {
          const option = document.createElement("option");
          option.value = gradeLetter;
          option.innerText = gradeLetter;
          select.appendChild(option);
        });

        row.appendChild(label);
        row.appendChild(select);
        form.appendChild(row);
      });
    });

    if (formClutterCount === 0) return;

    const btnContainer = document.createElement("div");
    Object.assign(btnContainer.style, {
      marginTop: "24px",
      display: "flex",
      justifyContent: isArabic ? "flex-start" : "flex-end",
    });

    const calculateBtn = document.createElement("button");
    calculateBtn.type = "submit";
    calculateBtn.className = "btn btn-primary";
    Object.assign(calculateBtn.style, {
      fontWeight: "600",
      padding: "10px 24px",
      fontSize: "0.95rem",
      borderRadius: "6px",
    });
    calculateBtn.innerText = texts.btnCalculate;
    btnContainer.appendChild(calculateBtn);
    form.appendChild(btnContainer);

    cardBody.appendChild(form);
    card.appendChild(cardHeader);
    card.appendChild(cardBody);

    yearsWrapper.prepend(card);

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const gradeOverrides = new Map();
      const selects = form.querySelectorAll("select");

      selects.forEach((select) => {
        if (select.value) gradeOverrides.set(select.name, select.value);
      });

      onCalculateCallback(gradeOverrides);
    });
  },
};
