window.UMSUpdater = {
  parseVersion: (versionStr) => {
    if (!versionStr) return [0, 0, 0];
    return versionStr
      .replace(/[^\d.]/g, "")
      .split(".")
      .map(Number);
  },

  isNewerVersion: (current, latest) => {
    const [cMajor, cMinor, cPatch] = window.UMSUpdater.parseVersion(current);
    const [lMajor, lMinor, lPatch] = window.UMSUpdater.parseVersion(latest);

    if (lMajor !== cMajor) return lMajor > cMajor;
    if (lMinor !== cMinor) return lMinor > cMinor;
    return lPatch > cPatch;
  },

  renderUpdateBanner: (
    currentVersion,
    latestVersion,
    releaseUrl,
    changelogArray,
  ) => {
    const mainContainer = document.querySelector(".container.ums-grades");
    if (!mainContainer) return;

    if (mainContainer.querySelector(".ums-update-banner")) return;

    const isArabic = window.isArabicPage;
    const texts = {
      title: isArabic
        ? "🎉 تحديث جديد متوفر لـ FCIS GPA Helper"
        : "🎉 FCIS GPA Helper Update Available",
      current: isArabic
        ? `الإصدار الحالي: v${currentVersion}`
        : `Current Version: v${currentVersion}`,
      latest: isArabic
        ? `الإصدار الأحدث: v${latestVersion}`
        : `Latest Version: v${latestVersion}`,
      whatsNew: isArabic ? "إيه الجديد في التحديث ده؟" : "What's New:",
      btnUpdate: isArabic ? "تحديث الآن" : "Update Now",
      btnDismiss: isArabic ? "إغلاق" : "Dismiss",
    };

    let changelogHtml = "";
    if (changelogArray && changelogArray.length > 0)
      changelogHtml = `
        <div style="margin: 0 0 16px 0; background: #f8fafc; padding: 12px 16px; border-radius: 6px; border: 1px solid #f1f5f9;">
          <strong style="display: block; margin-bottom: 6px; color: #334155; font-size: 0.9rem;">${texts.whatsNew}</strong>
          <ul style="margin: 0; padding-left: ${isArabic ? "0" : "20px"}; padding-right: ${isArabic ? "20px" : "0"}; color: #475569; font-size: 0.875rem; line-height: 1.5;">
            ${changelogArray.map((item) => `<li style="margin-bottom: 4px;">${item}</li>`).join("")}
          </ul>
        </div>
      `;

    const banner = document.createElement("div");
    banner.className = "ums-update-banner";

    Object.assign(banner.style, {
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderTop: "5px solid #007bff",
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "24px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      fontFamily: "inherit",
      direction: isArabic ? "rtl" : "ltr",
      textAlign: isArabic ? "right" : "left",
    });

    banner.innerHTML = `
      <h5 style="margin: 0 0 8px 0; font-weight: 700; color: #1e3a8a; font-size: 1.15rem;">${texts.title}</h5>
      <div style="display: flex; gap: 16px; margin-bottom: 14px; font-size: 0.875rem; color: #64748b; flex-wrap: wrap;">
        <span>${texts.current}</span>
        <span>•</span>
        <span>${texts.latest}</span>
      </div>
      ${changelogHtml}
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <button id="umsUpdateActionBtn" style="background: #007bff; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">${texts.btnUpdate}</button>
        <button id="umsUpdateDismissBtn" style="background: #f1f5f9; color: #475569; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">${texts.btnDismiss}</button>
      </div>
    `;

    banner
      .querySelector("#umsUpdateActionBtn")
      .addEventListener("click", () => {
        window.open(releaseUrl, "_blank");
      });

    banner
      .querySelector("#umsUpdateDismissBtn")
      .addEventListener("click", () => {
        banner.remove();
      });

    mainContainer.prepend(banner);
  },

  checkForUpdates: async () => {
    try {
      const username = "AhmedAbdoDev";
      const repository = "FCIS-GPA-Helper";
      const targetUrl = `https://raw.githubusercontent.com/${username}/${repository}/main/version.json`;

      const manifest = chrome.runtime.getManifest();
      const currentVersion = manifest.version;

      const response = await fetch(targetUrl, { cache: "no-cache" });
      if (!response.ok) return;

      const data = await response.json();
      if (!data || !data.version || !data.releaseUrl) return;

      const latestVersion = data.version;
      const releaseUrl = data.releaseUrl;

      let changelogArray = [];
      if (data.changelog)
        changelogArray = window.isArabicPage
          ? data.changelog.ar || []
          : data.changelog.en || [];

      if (window.UMSUpdater.isNewerVersion(currentVersion, latestVersion))
        window.UMSUpdater.renderUpdateBanner(
          currentVersion,
          latestVersion,
          releaseUrl,
          changelogArray,
        );
    } catch (error) {}
  },
};
