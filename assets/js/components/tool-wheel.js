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

export const initializeToolWheel = (products) => {
  const wheel = document.querySelector(".wheel");
  const pathGroup = document.querySelector("[data-segment-paths]");
  const segmentControls = document.querySelector("[data-segment-controls]");
  const activeName = document.querySelector("[data-active-name]");
  const activeDescription = document.querySelector("[data-active-description]");
  const activeLink = document.querySelector("[data-active-link]");
  const visitLabel = document.querySelector("[data-visit-label]");

  if (!wheel || !pathGroup || !segmentControls || products.length < 2) return;

  let selectors = [];
  let segmentPaths = [];
  let selectedIndex = 0;

  const selectProduct = (index) => {
    selectedIndex = (index + products.length) % products.length;
    const activeProduct = products[selectedIndex];

    wheel.setAttribute("data-active", String(selectedIndex));
    selectors.forEach((selector, selectorIndex) => {
      const isActive = selectorIndex === selectedIndex;
      selector.classList.toggle("is-active", isActive);
      selector.setAttribute("aria-pressed", String(isActive));
    });
    segmentPaths.forEach((path, pathIndex) => {
      path.classList.toggle("is-active", pathIndex === selectedIndex);
    });

    const language = document.documentElement.lang.startsWith("zh") ? "zh" : "en";
    if (activeName) activeName.textContent = activeProduct.name;
    if (activeDescription) {
      activeDescription.textContent = activeProduct.description[language];
    }
    if (activeLink) {
      const hasProductPage = Boolean(activeProduct.pageUrl);
      activeLink.classList.toggle("is-disabled", !hasProductPage);
      activeLink.setAttribute("aria-disabled", String(!hasProductPage));

      if (hasProductPage) {
        activeLink.setAttribute("href", activeProduct.pageUrl);
        activeLink.setAttribute(
          "aria-label",
          language === "zh"
            ? `访问 ${activeProduct.name} 专题页`
            : `Visit the ${activeProduct.name} product page`
        );
      } else {
        activeLink.removeAttribute("href");
        activeLink.setAttribute(
          "aria-label",
          language === "zh"
            ? `${activeProduct.name} 专题页准备中`
            : `${activeProduct.name} product page is coming soon`
        );
      }
    }
    if (visitLabel) {
      visitLabel.textContent = activeProduct.pageUrl
        ? (language === "zh" ? "专题页" : "Product page")
        : (language === "zh" ? "准备中" : "Coming soon");
    }
  };

  const segmentAngle = 360 / products.length;
  const gapAngle = Math.min(1.8, 7 / products.length);
  const labelRadius = products.length === 2 ? 34 : products.length <= 5 ? 36 : 37;
  const labelWidth = products.length === 2 ? 44 : products.length <= 4 ? 31 : products.length <= 5 ? 26 : products.length <= 6 ? 23 : 19;

  wheel.style.setProperty("--segment-count", String(products.length));
  wheel.style.setProperty("--tool-label-width", `${labelWidth}%`);
  wheel.setAttribute("data-count", String(products.length));

  products.forEach((product, index) => {
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
    button.setAttribute("aria-label", product.name);
    button.setAttribute("aria-pressed", "false");
    button.style.left = `${labelPoint.x}%`;
    button.style.top = `${labelPoint.y}%`;
    button.innerHTML = iconMarkup[product.icon] ?? `<span class="tool-monogram" aria-hidden="true"></span>`;

    const label = document.createElement("span");
    label.textContent = product.name;
    button.append(label);
    segmentControls.append(button);
  });

  selectors = [...segmentControls.querySelectorAll("[data-tool]")];
  segmentPaths = [...pathGroup.querySelectorAll(".segment-path")];

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const selector = event.target.closest("[data-tool]");
    if (selector) {
      selectProduct(Number(selector.getAttribute("data-tool")));
      return;
    }

    const cycleButton = event.target.closest("[data-cycle]");
    if (!cycleButton) return;

    const direction = cycleButton.getAttribute("data-cycle");
    selectProduct(selectedIndex + (direction === "previous" ? -1 : 1));
  });

  document.addEventListener("dvspatial:languagechange", () => {
    selectProduct(selectedIndex);
  });

  selectProduct(0);
};
