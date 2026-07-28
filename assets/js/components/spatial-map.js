export const initializeSpatialMap = () => {
  if (!window.L || !document.querySelector("#hero-map")) return;

  const map = window.L.map("hero-map", {
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

  window.L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    subdomains: "abcd",
    maxZoom: 19
  }).addTo(map);
};

