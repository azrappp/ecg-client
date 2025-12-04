import React, { useState } from "react";
import { SciChartSurface } from "scichart";
import EcgChartComponent from "./assets/ECGChartComponent";
SciChartSurface.useWasmFromCDN();
function App() {
  return (
    <div className="App">
      <EcgChartComponent />
    </div>
  );
}

export default App;
