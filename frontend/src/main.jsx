// main.tsx or main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { ExoplanetContextProvider } from "./context/ExoplanetContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ExoplanetContextProvider>
      <NextUIProvider>
        <App className="dark" />
      </NextUIProvider>
    </ExoplanetContextProvider>
  </React.StrictMode>
);
