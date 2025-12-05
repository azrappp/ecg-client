import React, { useEffect, useState, useRef } from "react";
import {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  ZoomPanModifier,
  MouseWheelZoomModifier,
  RolloverModifier,
  NumberRange,
  EAnimationType,
} from "scichart";

// Import the custom theme we defined above
import { customTheme } from "../styles/theme"; // Or define const customTheme = ... here

const SingleLeadChart = ({ data, verticalGroup, xVisibleRange, leadIndex }) => {
  const chartDivId = useRef(
    `chart-div-${leadIndex}-${Math.random().toString(36).substr(2, 9)}`
  );
  const [sciChartSurface, setSciChartSurface] = useState(null);
  const dataSeriesRef = useRef(null);
  const LEAD_NAMES = [
    "I",
    "II",
    "III",
    "aVR",
    "aVL",
    "aVF",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
  ];

  // EFFECT 1: Create Chart
  useEffect(() => {
    let isMounted = true;
    let autoDelete = true;

    const initChart = async () => {
      try {
        // 1. APPLY THEME HERE
        const { sciChartSurface: surface, wasmContext } =
          await SciChartSurface.create(
            chartDivId.current,
            { theme: customTheme } // <--- Switched from SciChartJsNavyTheme to customTheme
          );

        if (!isMounted) {
          surface.delete();
          return;
        }

        // --- AXES ---
        const xAxis = new NumericAxis(wasmContext, {
          visibleRange: xVisibleRange,
          drawMajorGridLines: true,
          drawMinorGridLines: false,
          axisTitle: LEAD_NAMES[leadIndex] || `Lead ${leadIndex + 1}`,
        });

        const yAxis = new NumericAxis(wasmContext, {
          autoRange: "Always",
          drawMajorGridLines: true,
          growBy: new NumberRange(0.1, 0.1),
        });

        surface.xAxes.add(xAxis);
        surface.yAxes.add(yAxis);

        // --- MODIFIERS ---
        const modifierGroupId = "SharedEventGroup";
        surface.chartModifiers.add(
          new ZoomPanModifier({ modifierGroup: modifierGroupId }),
          new MouseWheelZoomModifier({ modifierGroup: modifierGroupId }),
          new RolloverModifier({ modifierGroup: modifierGroupId })
        );

        // --- DATA SERIES ---
        const dataSeries = new XyDataSeries(wasmContext);
        dataSeriesRef.current = dataSeries;

        surface.renderableSeries.add(
          new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            stroke: "auto",
            strokeThickness: 2,
            animation: {
              type: EAnimationType.Sweep,
              options: { duration: 500 },
            },
          })
        );

        if (data && data.length > 0) {
          const xValues = data.map((_, i) => i);
          dataSeries.appendRange(xValues, data);
        }

        autoDelete = false;
        setSciChartSurface(surface);
      } catch (err) {
        console.error("Chart Init Failed", err);
      }
    };

    initChart();

    return () => {
      isMounted = false;
      if (autoDelete) {
        // cleanup logic handled in Effect 2
      }
    };
  }, []);

  // EFFECT 2: Cleanup
  useEffect(() => {
    return () => {
      if (sciChartSurface) {
        if (verticalGroup) {
          verticalGroup.removeSurfaceFromGroup(sciChartSurface);
        }
        sciChartSurface.delete();
        setSciChartSurface(null);
      }
    };
  }, [sciChartSurface, verticalGroup]);

  // EFFECT 3: Sync
  useEffect(() => {
    if (!sciChartSurface || !verticalGroup) return;
    try {
      verticalGroup.addSurfaceToGroup(sciChartSurface);
    } catch (error) {
      console.warn("Sync error (harmless)", error);
    }
  }, [sciChartSurface, verticalGroup]);

  // EFFECT 4: Update Data
  useEffect(() => {
    if (dataSeriesRef.current && data && data.length > 0) {
      const series = dataSeriesRef.current;
      series.clear();
      const xValues = data.map((_, i) => i);
      series.appendRange(xValues, data);
    }
  }, [data]);

  return (
    <div
      id={chartDivId.current}
      className="w-full h-[100px] mb-1 relative"
      style={{ height: "120px", width: "100%" }}
    />
  );
};

export default SingleLeadChart;
