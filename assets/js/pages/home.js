import { products } from "../data/products.js?v=20260728-3";
import { initializeDisplayPreferences } from "../components/display-preferences.js?v=20260728-3";
import { initializeToolWheel } from "../components/tool-wheel.js?v=20260728-3";

initializeDisplayPreferences();
initializeToolWheel(products);
