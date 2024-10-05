import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExoplanetSearch from "./pages/ExoplanetSearch";
import SkyView from "./pages/SkyView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExoplanetSearch />} /> {/* Search at / */}
        <Route path="/skyview" element={<SkyView />} /> {/* Sky view at /skyview */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
