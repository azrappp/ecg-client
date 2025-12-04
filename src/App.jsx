import React, { useState } from "react";
import { SciChartSurface } from "scichart";
import EcgChartComponent from "./assets/ECGChartComponent";
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
      <EcgChartComponent />
    </div>
  );
}

export default App;
