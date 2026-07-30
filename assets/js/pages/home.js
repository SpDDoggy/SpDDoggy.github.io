import { products } from "../data/products.js?v=20260730-1";
import { initializeDisplayPreferences } from "../components/display-preferences.js?v=20260730-2";
import { initializeProductTransition } from "../components/product-transition.js?v=20260729-1";
import { initializeToolWheel } from "../components/tool-wheel.js?v=20260730-1";

initializeDisplayPreferences();
initializeToolWheel(products);
initializeProductTransition();
