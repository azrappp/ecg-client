import React, { useMemo, useState, useEffect } from "react";
import { SciChartVerticalGroup, NumberRange } from "scichart";
import SingleLeadChart from "./SingleLeadChart";

const SignalVisualizer = ({ signalData }) => {
  // 1. Create the Vertical Group ONE time
  const verticalGroup = useMemo(() => new SciChartVerticalGroup(), []);

  // 2. Create the Shared Range (Mutable object)
  // We use useMemo here so the object reference doesn't change on re-renders
  const sharedXRange = useMemo(() => new NumberRange(0, 1000), []);

  const [visibleChartsCount, setVisibleChartsCount] = useState(0);

  // Update logic when data loads
  useEffect(() => {
    if (signalData && signalData.length > 0) {
      // Update the existing range object directly
      sharedXRange.min = 0;
      sharedXRange.max = signalData[0].length;
      setVisibleChartsCount(0);
    }
  }, [signalData, sharedXRange]);

  // Staggered Loading Logic (Keep this, it's good for performance)
  useEffect(() => {
    if (!signalData) return;
    if (visibleChartsCount < signalData.length) {
      const timer = setTimeout(() => {
        setVisibleChartsCount((prev) => prev + 1);
      }, 50); // Faster load time (50ms)
      return () => clearTimeout(timer);
    }
  }, [visibleChartsCount, signalData]);

  if (!signalData || signalData.length === 0) {
    return <div className="text-white">No Data</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-800">
      <h3 className="text-blue-300 mb-4 font-bold">Signal Visualizer</h3>

      <div className="flex flex-col gap-2">
        {signalData.slice(0, visibleChartsCount).map((signal, index) => (
          <SingleLeadChart
            key={index}
            leadIndex={index}
            data={signal} // Ensure 'signal' is an array of numbers like [-0.01, -0.02...]
            verticalGroup={verticalGroup}
            xVisibleRange={sharedXRange}
          />
        ))}
      </div>
    </div>
  );
};

export default SignalVisualizer;
