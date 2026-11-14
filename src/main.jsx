import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { applyStoredTheme } from "./components/layout/ThemePalette";

applyStoredTheme();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* reducedMotion="user" makes every framer animation respect          */}
    {/* prefers-reduced-motion automatically, as a second line of defense  */}
    {/* on top of our own useReducedMotion hook.                          */}
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>
);
