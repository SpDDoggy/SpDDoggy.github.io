try {
  const savedTheme = window.localStorage.getItem("dvspatial-theme");
  const savedLanguage = window.localStorage.getItem("dvspatial-language");

  if (savedTheme === "light" || savedTheme === "dark") {
    document.documentElement.dataset.theme = savedTheme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      savedTheme === "dark" ? "#0e141e" : "#f8fbff"
    );
  }
  if (savedLanguage === "zh" || savedLanguage === "en") {
    document.documentElement.lang = savedLanguage === "en" ? "en" : "zh-CN";
    document.documentElement.dataset.language = savedLanguage;
  }
} catch {
  // Keep the document default when storage is unavailable.
}
