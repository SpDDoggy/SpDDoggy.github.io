import { initializeDisplayPreferences } from "../components/display-preferences.js?v=20260729-3";

initializeDisplayPreferences();

const tabs = [...document.querySelectorAll("[data-product-tab]")];
const panels = [...document.querySelectorAll("[data-product-panel]")];

const selectProduct = (productId, updateUrl = true) => {
  const selectedTab = tabs.find((tab) => tab.dataset.productTab === productId);
  const selectedPanel = panels.find((panel) => panel.dataset.productPanel === productId);
  if (!selectedTab || !selectedPanel) return;

  tabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });

  panels.forEach((panel) => {
    const isSelected = panel === selectedPanel;
    panel.hidden = !isSelected;
    panel.classList.toggle("is-active", isSelected);
  });

  if (updateUrl) {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("product", productId);
    window.history.replaceState({}, "", nextUrl);
  }
};

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectProduct(tab.dataset.productTab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
    const nextTab = tabs[(index + direction + tabs.length) % tabs.length];
    selectProduct(nextTab.dataset.productTab);
    nextTab.focus();
  });
});

const requestedProduct = new URL(window.location.href).searchParams.get("product");
selectProduct(tabs.some((tab) => tab.dataset.productTab === requestedProduct) ? requestedProduct : "gdb", false);
