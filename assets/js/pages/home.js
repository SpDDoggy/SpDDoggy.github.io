import { products } from "../data/products.js";
import { initializeDisplayPreferences } from "../components/display-preferences.js";
import { initializeToolWheel } from "../components/tool-wheel.js";

initializeDisplayPreferences();
initializeToolWheel(products);
