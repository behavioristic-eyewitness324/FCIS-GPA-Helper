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

    if (chipsContainer.querySelector(".ums-chip--gpa")) return;

    const gradeLetter = window.getGradeLetterFromGPA(gpaValue);
    const dict = window.UMS_DICTIONARY;

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

    if (statsContainer.querySelector(".ums-stat")) return;

    const cgpaLetter = window.getGradeLetterFromGPA(cgpaValue);
    const dict = window.UMS_DICTIONARY;

    heroTop.innerHTML = `
      <div class="ums-stat">
        <div class="ums-stat__label">${dict.cumulativeGradeLabel}</div>
        <div class="ums-stat__value"><span class="ums-hero__grade-letter">  ${cgpaLetter}</span></div>
      </div>
      <div class="ums-hero__grade-text"></div>
    `;
    statsContainer.innerHTML = `
      <div class="ums-stat">
        <div class="ums-stat__label">${dict.cgpaLabel}</div>
        <div class="ums-stat__value">${cgpaValue.toFixed(3)}</div>
      </div>
    `;
  },
};
