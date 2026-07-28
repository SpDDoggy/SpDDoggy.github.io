(() => {
  const toolCatalog = [
    { name: "DvStudio", description: "ArcGIS Pro Add-in" },
    { name: "GDB Previewer", description: "GDB · SHP · MDB" },
    { name: "GeoAgent", description: "GIS workflow agent" },
    { name: "DvTools", description: "ArcGIS Pro tools" }
  ];

  const wheel = document.querySelector(".wheel");
  const selectors = [...document.querySelectorAll("[data-tool]")];
  const activeName = document.querySelector("[data-active-name]");
  const activeDescription = document.querySelector("[data-active-description]");
  const currentIndex = document.querySelector("[data-current-index]");
  let selectedIndex = 0;

  if (window.L) {
    const map = L.map("hero-map", {
      center: [31.2304, 121.4737],
      zoom: 11,
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

  const selectTool = (index) => {
    selectedIndex = (index + toolCatalog.length) % toolCatalog.length;
    const activeTool = toolCatalog[selectedIndex];

    wheel?.style.setProperty("--active-index", String(selectedIndex));
    wheel?.setAttribute("data-active", String(selectedIndex));

    selectors.forEach((selector, selectorIndex) => {
      const isActive = selectorIndex === selectedIndex;
      selector.classList.toggle("is-active", isActive);
      selector.setAttribute("aria-pressed", String(isActive));
    });

    if (activeName) activeName.textContent = activeTool.name;
    if (activeDescription) activeDescription.textContent = activeTool.description;
    if (currentIndex) currentIndex.textContent = String(selectedIndex + 1).padStart(2, "0");
    window.scrollTo(0, 0);
  };

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const selector = event.target.closest("[data-tool]");
    if (selector) {
      selectTool(Number(selector.getAttribute("data-tool")));
      return;
    }

    const button = event.target.closest("[data-cycle]");
    if (button) {
      const direction = button.getAttribute("data-cycle");
      selectTool(selectedIndex + (direction === "previous" ? -1 : 1));
    }
  });
})();
