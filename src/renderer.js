window.UMSRenderer = {
  renderSemesterGPA: (termElement, gpaValue) => {
    const termBtn = termElement.querySelector(".ums-term__btn");
    if (!termBtn) return;

    let chipsContainer = termBtn.querySelector(".ums-term__chips");

    if (!chipsContainer) {
      chipsContainer = document.createElement("span");
      chipsContainer.className = "ums-term__chips";

      const caretIcon = termBtn.querySelector(
        ".ums-term__caret, .fa-chevron-down",
      );
      if (caretIcon) termBtn.insertBefore(chipsContainer, caretIcon);
      else termBtn.appendChild(chipsContainer);
    }

    const gradeLetter = window.getGradeLetterFromGPA(gpaValue);
    const dict = window.UMS_DICTIONARY;

    const existingGradeChip = chipsContainer.querySelector(".ums-chip--grade");
    const existingGpaChip = chipsContainer.querySelector(".ums-chip--gpa");

    if (existingGradeChip && existingGpaChip) {
      existingGradeChip.innerText = `${dict.gradeLabel}: ${gradeLetter}`;
      existingGpaChip.innerText = `${dict.semesterGpaLabel}: ${gpaValue.toFixed(3)}`;
      return;
    }
    const gradeChip = document.createElement("span");
    gradeChip.className = "ums-chip ums-chip--grade";
    gradeChip.innerText = `${dict.gradeLabel}: ${gradeLetter}`;

    const gpaChip = document.createElement("span");
    gpaChip.className = "ums-chip ums-chip--gpa";
    gpaChip.innerText = `${dict.semesterGpaLabel}: ${gpaValue.toFixed(3)}`;

    chipsContainer.appendChild(gradeChip);
    chipsContainer.appendChild(gpaChip);
  },
  renderCGPA: (roundElement, heroElement, cgpaValue) => {
    let targetHero = heroElement;
    if (!targetHero) {
      targetHero = document.createElement("div");
      targetHero.className = "ums-hero";

      const roundTitle = roundElement.querySelector(".ums-round__title");
      if (roundTitle && roundTitle.nextSibling)
        roundElement.insertBefore(targetHero, roundTitle.nextSibling);
      else roundElement.prepend(targetHero);
    }
    let heroTop = targetHero.querySelector(".ums-hero__top");
    if (!heroTop) {
      heroTop = document.createElement("div");
      heroTop.className = "ums-hero__top";
      targetHero.prepend(heroTop);
    }

    let statsContainer = targetHero.querySelector(".ums-stats");
    if (!statsContainer) {
      statsContainer = document.createElement("div");
      statsContainer.className = "ums-stats";
      targetHero.appendChild(statsContainer);
    }

    const cgpaLetter = window.getGradeLetterFromGPA(cgpaValue);
    const dict = window.UMS_DICTIONARY;

    const gradeLetterSpan = heroTop.querySelector(".ums-hero__grade-letter");
    if (gradeLetterSpan) gradeLetterSpan.innerText = ` ${cgpaLetter}`;
    else
      heroTop.innerHTML = `
        <div class="ums-stat">
          <div class="ums-stat__label">${dict.cumulativeGradeLabel}</div>
          <div class="ums-stat__value"><span class="ums-hero__grade-letter"> ${cgpaLetter}</span></div>
        </div>
        <div class="ums-hero__grade-text"></div>
      `;
    const cgpaValueDiv = statsContainer.querySelector(".ums-stat__value");

    if (cgpaValueDiv) cgpaValueDiv.innerText = cgpaValue.toFixed(3);
    else
      statsContainer.innerHTML = `
        <div class="ums-stat">
          <div class="ums-stat__label">${dict.cgpaLabel}</div>
          <div class="ums-stat__value">${cgpaValue.toFixed(3)}</div>
        </div>
      `;
  },
};
