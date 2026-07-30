export const initializeReleaseReader = () => {
  const versionControls = [...document.querySelectorAll("[data-version-target]")];
  const releasePanels = [...document.querySelectorAll("[data-release-panel]")];
  const tocTitle = document.querySelector("[data-release-toc-title]");
  const tocLinks = document.querySelector("[data-release-toc-links]");
  let sectionObserver = null;
  let selectedVersion = "v3";

  const versionLabels = Object.freeze({
    v3: "V3",
    v2: "V2",
    v1: "V1"
  });

  const setCurrentSection = (sectionId) => {
    if (!tocLinks) return;
    [...tocLinks.querySelectorAll("a")].forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("is-current", isCurrent);
      if (isCurrent) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const rebuildToc = (panel, versionKey) => {
    if (!tocLinks || !tocTitle) return;

    const sections = [...panel.querySelectorAll("[data-toc-label]")];
    const isEnglish = document.documentElement.lang === "en";
    tocTitle.textContent = isEnglish
      ? `In ${versionLabels[versionKey]}`
      : `在 ${versionLabels[versionKey]} 中`;
    tocLinks.replaceChildren();

    sections.forEach((section) => {
      const link = document.createElement("a");
      link.href = `#${section.id}`;
      link.textContent = section.dataset.tocLabel;
      tocLinks.append(link);
    });

    sectionObserver?.disconnect();
    if (!sections.length) return;

    setCurrentSection(sections[0].id);
    sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0];
        if (visibleEntry) setCurrentSection(visibleEntry.target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  };

  const selectVersion = (versionKey, updateUrl = true) => {
    const activePanel = releasePanels.find((panel) => panel.dataset.releasePanel === versionKey);
    if (!activePanel) return;
    selectedVersion = versionKey;

    versionControls.forEach((control) => {
      const isActive = control.dataset.versionTarget === versionKey;
      control.classList.toggle("version-active", isActive);
      control.setAttribute("aria-pressed", String(isActive));
      const marker = control.querySelector("span");
      if (marker) marker.textContent = isActive ? "⌄" : "›";
    });

    releasePanels.forEach((panel) => {
      panel.hidden = panel !== activePanel;
    });
    rebuildToc(activePanel, versionKey);

    if (updateUrl) {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set("version", versionKey);
      nextUrl.hash = "";
      window.history.replaceState(null, "", nextUrl);
    }
  };

  versionControls.forEach((control) => {
    control.addEventListener("click", () => selectVersion(control.dataset.versionTarget));
  });

  document.addEventListener("dvspatial:languagechange", () => {
    const activePanel = releasePanels.find((panel) => panel.dataset.releasePanel === selectedVersion);
    if (activePanel) rebuildToc(activePanel, selectedVersion);
  });

  const requestedVersion = new URL(window.location.href).searchParams.get("version");
  const initialVersion = versionLabels[requestedVersion] ? requestedVersion : "v3";
  selectVersion(initialVersion, false);
  if (requestedVersion && requestedVersion !== initialVersion) {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("version", initialVersion);
    nextUrl.hash = "";
    window.history.replaceState(null, "", nextUrl);
  }
};
