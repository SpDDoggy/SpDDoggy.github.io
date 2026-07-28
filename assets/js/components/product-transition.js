const isPlainPrimaryClick = (event) =>
  event.button === 0
  && !event.altKey
  && !event.ctrlKey
  && !event.metaKey
  && !event.shiftKey;

const clearTransitionState = () => {
  document.body.classList.remove("is-product-leaving");
  document.body.removeAttribute("aria-busy");
  document.querySelector("[data-product-transition]")?.remove();
};

export const initializeProductTransition = () => {
  const productLink = document.querySelector("[data-active-link]");

  if (!productLink) {
    return;
  }

  window.addEventListener("pageshow", clearTransitionState);

  productLink.addEventListener("click", (event) => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (
      event.defaultPrevented
      || !isPlainPrimaryClick(event)
      || productLink.target === "_blank"
      || productLink.hasAttribute("download")
      || productLink.getAttribute("aria-disabled") === "true"
      || prefersReducedMotion
      || document.body.classList.contains("is-product-leaving")
    ) {
      return;
    }

    const destination = productLink.href;

    if (!destination) {
      return;
    }

    event.preventDefault();

    const bounds = productLink.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const farthestX = Math.max(centerX, window.innerWidth - centerX);
    const farthestY = Math.max(centerY, window.innerHeight - centerY);
    const coverDiameter = Math.hypot(farthestX, farthestY) * 2.12;
    const startSize = Math.max(bounds.width, 1);
    const portal = document.createElement("span");

    portal.dataset.productTransition = "";
    portal.className = "product-transition-portal";
    portal.setAttribute("aria-hidden", "true");
    portal.style.setProperty("--portal-x", `${centerX}px`);
    portal.style.setProperty("--portal-y", `${centerY}px`);
    portal.style.setProperty("--portal-size", `${startSize}px`);
    portal.style.setProperty("--portal-scale", String(coverDiameter / startSize));

    document.body.append(portal);
    document.body.classList.add("is-product-leaving");
    document.body.setAttribute("aria-busy", "true");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => portal.classList.add("is-active"));
    });

    window.setTimeout(() => {
      window.location.assign(destination);
    }, 480);
  });
};
