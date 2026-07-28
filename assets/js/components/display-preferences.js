const copy = {
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
    languageAction: "Switch to English",
    themeLightAction: "切换浅色模式",
    themeDarkAction: "切换深色模式",
    pageTitle: "DvSpatial · GIS 工具入口",
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
    languageAction: "切换到中文",
    themeLightAction: "Switch to light theme",
    themeDarkAction: "Switch to dark theme",
    pageTitle: "DvSpatial · GIS tools",
    pageDescription: "Independent GIS software, ArcGIS Pro tools, and spatial intelligence practice by David."
  }
};

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

export const initializeDisplayPreferences = () => {
  const root = document.documentElement;
  const languageButton = document.querySelector("[data-language-toggle]");
  const languageLabel = document.querySelector("[data-language-label]");
  const themeButton = document.querySelector("[data-theme-toggle]");
  let language = readPreference("dvspatial-language", "zh");
  let theme = readPreference("dvspatial-theme", "light");

  const applyLanguage = () => {
    const dictionary = copy[language];
    root.lang = language === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (key && dictionary[key]) element.textContent = dictionary[key];
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      const key = element.getAttribute("data-i18n-aria");
      if (key && dictionary[key]) element.setAttribute("aria-label", dictionary[key]);
    });
    if (languageLabel) languageLabel.textContent = language === "zh" ? "CN" : "EN";
    languageButton?.setAttribute("aria-label", dictionary.languageAction);
    themeButton?.setAttribute(
      "aria-label",
      theme === "dark" ? dictionary.themeLightAction : dictionary.themeDarkAction
    );
    document.title = dictionary.pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", dictionary.pageDescription);
    document.dispatchEvent(new CustomEvent("dvspatial:languagechange", {
      detail: { language }
    }));
  };

  const applyTheme = () => {
    root.dataset.theme = theme;
    themeButton?.setAttribute("aria-pressed", String(theme === "dark"));
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      theme === "dark" ? "#0e141e" : "#f8fbff"
    );
    applyLanguage();
  };

  languageButton?.addEventListener("click", () => {
    language = language === "zh" ? "en" : "zh";
    writePreference("dvspatial-language", language);
    applyLanguage();
  });

  themeButton?.addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";
    writePreference("dvspatial-theme", theme);
    applyTheme();
  });

  applyTheme();
};
