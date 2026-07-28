import { products } from "../data/products.js";
import { initializeMobileNav } from "../components/mobile-nav.js";
import { initializeSpatialMap } from "../components/spatial-map.js";
import { initializeToolWheel } from "../components/tool-wheel.js";

initializeToolWheel(products);
initializeSpatialMap();
initializeMobileNav();

