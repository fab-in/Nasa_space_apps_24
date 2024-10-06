import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExoplanetSearch from "./pages/ExoplanetSearch";
import SkyView from "./pages/SkyView";
import Constellation from "./pages/Constellation";
// import SkyView2 from "./pages/SkyView2";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExoplanetSearch />} /> {/* Search at / */}
        <Route path="/skyview" element={<SkyView />} /> {/* Sky view at /skyview */}
        <Route path="/constellation" element={<Constellation />} /> {/* Consteellatiom */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
