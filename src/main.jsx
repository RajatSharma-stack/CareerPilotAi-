import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { SkillProvider } from "./context/SkillContext";
import { CareerProvider } from "./context/CareerContext";

import App from "./App.jsx";
import { RoadmapProvider } from "./context/RoadmapContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CareerProvider>
      <SkillProvider>
        <RoadmapProvider>
          <App />
        </RoadmapProvider>
      </SkillProvider>
    </CareerProvider>
  </StrictMode>,
);
