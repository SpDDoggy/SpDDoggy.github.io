import { initializeDisplayPreferences } from "../components/display-preferences.js?v=20260730-4";

initializeDisplayPreferences();

const productTabs = [...document.querySelectorAll("[data-product-tab]")];
const productPanels = [...document.querySelectorAll("[data-product-panel]")];
const versionOptions = [...document.querySelectorAll("[data-version-target]")];
const versionPanels = [...document.querySelectorAll("[data-version-panel]")];

const selectVersion = (versionId, updateUrl = true) => {
  const selectedOption = versionOptions.find((option) => option.dataset.versionTarget === versionId);
  const selectedPanel = versionPanels.find((panel) => panel.dataset.versionPanel === versionId);
  if (!selectedOption || !selectedPanel) return;

  const ownerPanel = selectedOption.closest("[data-product-panel]");
  ownerPanel?.querySelectorAll("[data-version-target]").forEach((option) => {
    const isSelected = option === selectedOption;
    option.classList.toggle("is-active", isSelected);
    option.setAttribute("aria-pressed", String(isSelected));
  });
  ownerPanel?.querySelectorAll("[data-version-panel]").forEach((panel) => {
    const isSelected = panel === selectedPanel;
    panel.hidden = !isSelected;
    panel.classList.toggle("is-active", isSelected);
  });

  if (updateUrl) {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("version", versionId);
    window.history.replaceState({}, "", nextUrl);
  }
};

const selectProduct = (productId, updateUrl = true) => {
  const selectedTab = productTabs.find((tab) => tab.dataset.productTab === productId);
  const selectedPanel = productPanels.find((panel) => panel.dataset.productPanel === productId);
  if (!selectedTab || !selectedPanel) return;

  productTabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });
  productPanels.forEach((panel) => {
    const isSelected = panel === selectedPanel;
    panel.hidden = !isSelected;
    panel.classList.toggle("is-active", isSelected);
  });

  const activeVersion = selectedPanel.querySelector("[data-version-target].is-active")
    ?? selectedPanel.querySelector("[data-version-target]");

  if (updateUrl) {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("product", productId);
    if (activeVersion) nextUrl.searchParams.set("version", activeVersion.dataset.versionTarget);
    else nextUrl.searchParams.delete("version");
    window.history.replaceState({}, "", nextUrl);
  }
};

productTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectProduct(tab.dataset.productTab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextTab = productTabs[(index + direction + productTabs.length) % productTabs.length];
    selectProduct(nextTab.dataset.productTab);
    nextTab.focus();
  });
});

versionOptions.forEach((option, index) => {
  option.addEventListener("click", () => selectVersion(option.dataset.versionTarget));
  option.addEventListener("keydown", (event) => {
    if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;
    const ownerPanel = option.closest("[data-product-panel]");
    const ownerOptions = [...ownerPanel.querySelectorAll("[data-version-target]")];
    const ownerIndex = ownerOptions.indexOf(option);
    if (ownerIndex < 0) return;
    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const nextOption = ownerOptions[(ownerIndex + direction + ownerOptions.length) % ownerOptions.length];
    selectVersion(nextOption.dataset.versionTarget);
    nextOption.focus();
  });
});

const requestedProduct = new URL(window.location.href).searchParams.get("product");
const initialProduct = productTabs.some((tab) => tab.dataset.productTab === requestedProduct)
  ? requestedProduct
  : "gdb";
selectProduct(initialProduct, false);

const requestedVersion = new URL(window.location.href).searchParams.get("version");
const requestedOption = versionOptions.find((option) => option.dataset.versionTarget === requestedVersion);
if (requestedOption && requestedOption.closest("[data-product-panel]")?.dataset.productPanel === initialProduct) {
  selectVersion(requestedVersion, false);
} else if (requestedVersion) {
  const activeOption = productPanels
    .find((panel) => panel.dataset.productPanel === initialProduct)
    ?.querySelector("[data-version-target].is-active");
  if (activeOption) selectVersion(activeOption.dataset.versionTarget);
}
