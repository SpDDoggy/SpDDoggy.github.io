import { products } from "../data/products.js?v=20260728-4";
import { initializeDisplayPreferences } from "../components/display-preferences.js?v=20260728-4";
import { initializeProductTransition } from "../components/product-transition.js?v=20260728-4";
import { initializeToolWheel } from "../components/tool-wheel.js?v=20260728-4";

initializeDisplayPreferences();
initializeToolWheel(products);
initializeProductTransition();
