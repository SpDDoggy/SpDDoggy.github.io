(() => {
  const toolCatalog = [
    { name: "DvStudio", description: "ArcGIS Pro Add-in", icon: "layers" },
    { name: "GDB Previewer", description: "GDB · SHP · MDB", icon: "database" },
    { name: "GeoAgent", description: "GIS workflow agent", icon: "agent" },
    { name: "DEM Studio", description: "Local-first terrain", icon: "terrain" },
    { name: "DvTools", description: "ArcGIS Pro tools", icon: "tools" }
  ];

  const wheel = document.querySelector(".wheel");
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#site-nav");
  const pathGroup = document.querySelector("[data-segment-paths]");
  const segmentControls = document.querySelector("[data-segment-controls]");
  const activeName = document.querySelector("[data-active-name]");
  const activeDescription = document.querySelector("[data-active-description]");
  const currentIndex = document.querySelector("[data-current-index]");
  const totalCount = document.querySelector("[data-total-count]");
  let selectors = [];
  let segmentPaths = [];
  let selectedIndex = 0;

  const iconMarkup = {
    layers: `
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 4 27 10 16 16 5 10 16 4Z"></path>
        <path d="m5 15 11 6 11-6"></path>
        <path d="m5 20 11 6 11-6"></path>
      </svg>`,
    database: `
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <ellipse cx="16" cy="7" rx="9" ry="4"></ellipse>
        <path d="M7 7v7c0 2.2 4 4 9 4s9-1.8 9-4V7"></path>
        <path d="M7 14v7c0 2.2 4 4 9 4s9-1.8 9-4v-7"></path>
      </svg>`,
    agent: `
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect x="7" y="10" width="18" height="14" rx="4"></rect>
        <path d="M16 5v5M12 23v4M20 23v4"></path>
        <circle cx="12" cy="16" r="1"></circle>
        <circle cx="20" cy="16" r="1"></circle>
      </svg>`,
    terrain: `
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="m4 24 8-13 4 6 3-4 9 11H4Z"></path>
        <path d="m9 20 3-3 3 3 3-2 5 6"></path>
      </svg>`,
    tools: `
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M21 5a8 8 0 0 0-9 10L5 22l5 5 7-7a8 8 0 0 0 10-9l-5 5-5-1-1-5 5-5Z"></path>
      </svg>`
  };

  const pointOnCircle = (radius, angle) => {
    const radians = (angle - 90) * Math.PI / 180;
    return {
      x: 50 + radius * Math.cos(radians),
      y: 50 + radius * Math.sin(radians)
    };
  };

  const ringSegmentPath = (startAngle, endAngle) => {
    const outerRadius = 48;
    const innerRadius = 17.5;
    const outerStart = pointOnCircle(outerRadius, startAngle);
    const outerEnd = pointOnCircle(outerRadius, endAngle);
    const innerEnd = pointOnCircle(innerRadius, endAngle);
    const innerStart = pointOnCircle(innerRadius, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerEnd.x} ${innerEnd.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
      "Z"
    ].join(" ");
  };

  const renderSegments = () => {
    if (!wheel || !pathGroup || !segmentControls || toolCatalog.length < 2) return;

    pathGroup.replaceChildren();
    segmentControls.replaceChildren();
    const segmentAngle = 360 / toolCatalog.length;
    const gapAngle = Math.min(1.8, 7 / toolCatalog.length);
    const labelRadius = toolCatalog.length <= 5 ? 36 : 37;
    const labelWidth = toolCatalog.length <= 4 ? 31 : toolCatalog.length <= 5 ? 26 : toolCatalog.length <= 6 ? 23 : 19;

    wheel.style.setProperty("--segment-count", String(toolCatalog.length));
    wheel.style.setProperty("--tool-label-width", `${labelWidth}%`);
    wheel.setAttribute("data-count", String(toolCatalog.length));

    toolCatalog.forEach((tool, index) => {
      const centerAngle = index * segmentAngle;
      const startAngle = centerAngle - segmentAngle / 2 + gapAngle;
      const endAngle = centerAngle + segmentAngle / 2 - gapAngle;
      const labelPoint = pointOnCircle(labelRadius, centerAngle);

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("class", "segment-path");
      path.setAttribute("d", ringSegmentPath(startAngle, endAngle));
      pathGroup.append(path);

      const button = document.createElement("button");
      button.className = "tool-sector";
      button.type = "button";
      button.dataset.tool = String(index);
      button.setAttribute("aria-label", tool.name);
      button.setAttribute("aria-pressed", "false");
      button.style.left = `${labelPoint.x}%`;
      button.style.top = `${labelPoint.y}%`;
      button.innerHTML = iconMarkup[tool.icon] ?? `<span class="tool-monogram" aria-hidden="true"></span>`;

      const label = document.createElement("span");
      label.textContent = tool.name;
      button.append(label);
      segmentControls.append(button);
    });

    selectors = [...segmentControls.querySelectorAll("[data-tool]")];
    segmentPaths = [...pathGroup.querySelectorAll(".segment-path")];
    if (totalCount) totalCount.textContent = `/ ${String(toolCatalog.length).padStart(2, "0")}`;
  };

  const selectTool = (index) => {
    selectedIndex = (index + toolCatalog.length) % toolCatalog.length;
    const activeTool = toolCatalog[selectedIndex];

    wheel?.setAttribute("data-active", String(selectedIndex));
    selectors.forEach((selector, selectorIndex) => {
      const isActive = selectorIndex === selectedIndex;
      selector.classList.toggle("is-active", isActive);
      selector.setAttribute("aria-pressed", String(isActive));
    });
    segmentPaths.forEach((path, pathIndex) => {
      path.classList.toggle("is-active", pathIndex === selectedIndex);
    });

    if (activeName) activeName.textContent = activeTool.name;
    if (activeDescription) activeDescription.textContent = activeTool.description;
    if (currentIndex) currentIndex.textContent = String(selectedIndex + 1).padStart(2, "0");
    window.scrollTo(0, 0);
  };

  renderSegments();
  selectTool(0);

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

  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "打开导航" : "关闭导航");
    navigation?.classList.toggle("is-open", !isOpen);
  });

  navigation?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element) || !event.target.closest("a")) return;
    navigation.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "打开导航");
  });
})();
