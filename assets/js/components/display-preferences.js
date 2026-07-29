const homeCopy = {
  zh: {
    skipLink: "跳到主要内容",
    siteTools: "站点工具",
    titleLead: "尽力让地理数据",
    titleAccent: "触手可及",
    intro: "DvStudio 与 GDB Previewer：围绕 ArcGIS Pro 工作流和空间数据查看打造的独立工具。",
    downloadSpace: "下载空间",
    active: "当前产品",
    productNavigation: "产品导航",
    previousProductAction: "上一个产品",
    nextProductAction: "下一个产品",
    pageTitle: "DvSpatial",
    pageDescription: "David 的 GIS 软件、ArcGIS Pro 工具与空间智能实践入口。"
  },
  en: {
    skipLink: "Skip to main content",
    siteTools: "Site tools",
    titleLead: "Making geospatial data",
    titleAccent: "within reach",
    intro: "DvStudio and GDB Previewer—independent tools for ArcGIS Pro workflows and spatial data inspection.",
    downloadSpace: "Downloads",
    active: "Active",
    productNavigation: "Product navigation",
    previousProductAction: "Previous product",
    nextProductAction: "Next product",
    pageTitle: "DvSpatial",
    pageDescription: "Independent GIS software, ArcGIS Pro tools, and spatial intelligence practice by David."
  }
};

const toolMarkup = `
  <button class="utility-control language-control" type="button" data-language-toggle aria-label="Switch to English">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8"></circle>
      <path d="M4 12h16M12 4c2.2 2.2 3.3 4.9 3.3 8S14.2 17.8 12 20M12 4C9.8 6.2 8.7 8.9 8.7 12S9.8 17.8 12 20"></path>
    </svg>
    <span data-language-label>CN</span>
  </button>
  <button class="utility-control" type="button" data-theme-toggle aria-label="切换深色模式" aria-pressed="false">
    <svg class="moon-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 15.2A8.1 8.1 0 0 1 8.8 5 8.1 8.1 0 1 0 19 15.2Z"></path>
    </svg>
    <svg class="sun-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>
    </svg>
  </button>
  <a class="utility-control" href="https://github.com/SpDDoggy" target="_blank" rel="noreferrer" aria-label="GitHub">
    <svg class="github-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.7a9.4 9.4 0 0 0-3 18.3c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.4-2.3-.3-4.7-1.1-4.7-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.5 9.5 0 0 1 5 0c2-1.3 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.7 3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.7 5 .4.3.7 1 .7 1.9v2.7c0 .3.2.6.7.5A9.4 9.4 0 0 0 12 2.7Z"></path>
    </svg>
  </a>`;

const elementDefaults = new WeakMap();

const readPreference = (key, fallback) => {
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

const writePreference = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // The page remains functional when storage is unavailable.
  }
};

const captureDefaults = (element) => {
  if (!elementDefaults.has(element)) {
    elementDefaults.set(element, {
      text: element.textContent,
      aria: element.getAttribute("aria-label"),
      alt: element.getAttribute("alt"),
      toc: element.dataset.tocLabel
    });
  }
  return elementDefaults.get(element);
};

const renderSiteTools = () => {
  document.querySelectorAll("[data-site-tools]").forEach((container) => {
    container.classList.add("header-controls");
    container.setAttribute("role", "group");
    container.innerHTML = toolMarkup;
  });
};

export const initializeDisplayPreferences = () => {
  const root = document.documentElement;
  if (root.dataset.preferencesReady === "true") return;
  root.dataset.preferencesReady = "true";

  renderSiteTools();

  const languageButtons = [...document.querySelectorAll("[data-language-toggle]")];
  const languageLabels = [...document.querySelectorAll("[data-language-label]")];
  const themeButtons = [...document.querySelectorAll("[data-theme-toggle]")];
  const pageTitleZh = document.title;
  const pageDescriptionElement = document.querySelector('meta[name="description"]');
  const pageDescriptionZh = pageDescriptionElement?.getAttribute("content") ?? "";
  let language = readPreference("dvspatial-language", "zh");
  let theme = readPreference("dvspatial-theme", "light");

  if (language !== "zh" && language !== "en") language = "zh";
  if (theme !== "light" && theme !== "dark") theme = "light";

  const applyLanguage = () => {
    const dictionary = homeCopy[language];
    const isEnglish = language === "en";
    root.lang = isEnglish ? "en" : "zh-CN";
    root.dataset.language = language;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (key && dictionary[key]) element.textContent = dictionary[key];
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      const key = element.getAttribute("data-i18n-aria");
      if (key && dictionary[key]) element.setAttribute("aria-label", dictionary[key]);
    });

    document.querySelectorAll("[data-copy-en]").forEach((element) => {
      const defaults = captureDefaults(element);
      element.textContent = isEnglish ? element.dataset.copyEn : defaults.text;
    });
    document.querySelectorAll("[data-aria-en]").forEach((element) => {
      const defaults = captureDefaults(element);
      const value = isEnglish ? element.dataset.ariaEn : defaults.aria;
      if (value) element.setAttribute("aria-label", value);
    });
    document.querySelectorAll("[data-alt-en]").forEach((element) => {
      const defaults = captureDefaults(element);
      const value = isEnglish ? element.dataset.altEn : defaults.alt;
      if (value) element.setAttribute("alt", value);
    });
    document.querySelectorAll("[data-toc-en]").forEach((element) => {
      const defaults = captureDefaults(element);
      element.dataset.tocLabel = isEnglish ? element.dataset.tocEn : defaults.toc;
    });

    languageLabels.forEach((label) => {
      label.textContent = isEnglish ? "EN" : "CN";
    });
    languageButtons.forEach((button) => {
      button.setAttribute("aria-label", dictionary.languageAction);
    });
    themeButtons.forEach((button) => {
      button.setAttribute(
        "aria-label",
        theme === "dark" ? dictionary.themeLightAction : dictionary.themeDarkAction
      );
    });
    document.querySelectorAll("[data-site-tools]").forEach((container) => {
      container.setAttribute("aria-label", dictionary.siteTools);
    });

    document.title = isEnglish
      ? root.dataset.titleEn ?? dictionary.pageTitle
      : pageTitleZh;
    if (pageDescriptionElement) {
      pageDescriptionElement.setAttribute(
        "content",
        isEnglish ? root.dataset.descriptionEn ?? dictionary.pageDescription : pageDescriptionZh
      );
    }

    document.dispatchEvent(new CustomEvent("dvspatial:languagechange", {
      detail: { language }
    }));
  };

  const applyTheme = () => {
    root.dataset.theme = theme;
    themeButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(theme === "dark"));
    });
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      theme === "dark" ? "#0e141e" : "#f8fbff"
    );
    applyLanguage();
  };

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      language = language === "zh" ? "en" : "zh";
      writePreference("dvspatial-language", language);
      applyLanguage();
    });
  });

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      theme = theme === "light" ? "dark" : "light";
      writePreference("dvspatial-theme", theme);
      applyTheme();
    });
  });

  applyTheme();
};
