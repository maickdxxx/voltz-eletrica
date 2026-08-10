import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CorujaContentGate, CorujaProvider } from "./coruja-template/content";
import { getCorujaPreviewBasename } from "./lib/coruja-preview";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CorujaProvider>
      <CorujaContentGate>
        <BrowserRouter basename={getCorujaPreviewBasename()}>
          <App />
        </BrowserRouter>
      </CorujaContentGate>
    </CorujaProvider>
  </StrictMode>,
);
