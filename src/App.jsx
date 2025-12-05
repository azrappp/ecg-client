import React, { useState } from "react";
import { SciChartSurface } from "scichart";
import EcgChartComponent from "./assets/ECGChartComponent";
import EcgDashboard from "./pages/EcgDashboard";
SciChartSurface.useWasmFromCDN();
function App() {
  return (
    <div
      style={{
        width: "100%",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <EcgDashboard />
    </div>
  );
}

export default App;
