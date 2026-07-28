try {
  const savedTheme = window.localStorage.getItem("dvspatial-theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    document.documentElement.dataset.theme = savedTheme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      savedTheme === "dark" ? "#0e141e" : "#f8fbff"
    );
  }
} catch {
  // Keep the document default when storage is unavailable.
}
