(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#site-nav");
  const dialog = document.querySelector("[data-dialog]");
  const dialogImage = document.querySelector("[data-dialog-image]");
  const dialogClose = document.querySelector("[data-dialog-close]");
  const previewButtons = document.querySelectorAll("[data-preview]");

  if (window.L) {
    const map = L.map("hero-map", {
      center: [31.2304, 121.4737],
      zoom: 10,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      tap: false,
      touchZoom: false
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 19
    }).addTo(map);
  }

  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "打开导航" : "关闭导航");
    navigation?.classList.toggle("is-open", !isOpen);
  });

  navigation?.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLAnchorElement)) return;
    navigation.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "打开导航");
  });

  previewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const source = button.getAttribute("data-preview");
      if (!source || !dialog || !dialogImage) return;
      dialogImage.src = source;
      dialog.showModal();
    });
  });

  dialogClose?.addEventListener("click", () => dialog?.close());

  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
