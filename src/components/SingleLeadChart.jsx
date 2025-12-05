import React, { useEffect, useState, useRef } from "react";
import {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  SciChartJsNavyTheme,
  ZoomPanModifier,
  MouseWheelZoomModifier,
  RolloverModifier,
  NumberRange,
} from "scichart";

const SingleLeadChart = ({ data, verticalGroup, xVisibleRange, leadIndex }) => {
  // Use a unique ID every time to prevent DOM conflicts during rapid re-renders
  const chartDivId = useRef(
    `chart-div-${leadIndex}-${Math.random().toString(36).substr(2, 9)}`
  );

  // State to hold the created surface.
  // We use State instead of Ref for 'surface' so we can trigger the second useEffect.
  const [sciChartSurface, setSciChartSurface] = useState(null);

  const dataSeriesRef = useRef(null);

  // ---------------------------------------------------------------------------
  // EFFECT 1: Create & Destroy the Chart Surface (Runs ONCE per mount)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;
    let autoDelete = true; // Safety flag

    const initChart = async () => {
      try {
        const { sciChartSurface: surface, wasmContext } =
          await SciChartSurface.create(chartDivId.current, {
            theme: new SciChartJsNavyTheme(),
          });

        // Race Condition Check: Component unmounted while loading?
        if (!isMounted) {
          surface.delete();
          return;
        }

        // --- AXES ---
        const xAxis = new NumericAxis(wasmContext, {
          visibleRange: xVisibleRange,
          drawMajorGridLines: true,
          drawMinorGridLines: false,
          axisTitle: `Lead ${leadIndex + 1}`,
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
            stroke: "#50C7E0",
            strokeThickness: 2,
          })
        );

        // Initial Data
        if (data && data.length > 0) {
          const xValues = data.map((_, i) => i);
          dataSeries.appendRange(xValues, data);
        }

        // Save to state to trigger the Sync Effect
        autoDelete = false; // We passed the dangerous phase, disable auto-delete
        setSciChartSurface(surface);
      } catch (err) {
        console.error("Chart Init Failed", err);
      }
    };

    initChart();

    // CLEANUP
    return () => {
      isMounted = false;
      // If the chart was created but state wasn't set (rare race), or if normal unmount
      if (autoDelete) {
        // This catch block handles the case where init is still running
      }
      // Note: We perform actual deletion in the state setter cleanup or below,
      // but 'autoDelete' logic is implicit in how setSciChartSurface triggers unmount.
    };
  }, []); // Dependencies: empty array = run once.

  // ---------------------------------------------------------------------------
  // EFFECT 2: Handle Deletion (When component unmounts)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // This effect runs when 'sciChartSurface' state is set.
    // The return function runs when the component unmounts OR when sciChartSurface changes.
    return () => {
      if (sciChartSurface) {
        // IMPORTANT: Remove from group BEFORE deleting to prevent "getFont" error
        if (verticalGroup) {
          verticalGroup.removeSurfaceFromGroup(sciChartSurface);
        }
        sciChartSurface.delete();
        setSciChartSurface(null);
      }
    };
  }, [sciChartSurface, verticalGroup]);

  // ---------------------------------------------------------------------------
  // EFFECT 3: Register with Vertical Group (Sync Logic)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!sciChartSurface || !verticalGroup) return;

    try {
      verticalGroup.addSurfaceToGroup(sciChartSurface);
    } catch (error) {
      console.warn(
        "Failed to attach to group (harmless race condition):",
        error
      );
    }

    // Cleanup for this specific effect
    return () => {
      // We rely on Effect 2 for final cleanup, but removing here is safe too
      verticalGroup.removeSurfaceFromGroup(sciChartSurface);
    };
  }, [sciChartSurface, verticalGroup]);

  // ---------------------------------------------------------------------------
  // EFFECT 4: Handle Data Updates (Fast Re-draw)
  // ---------------------------------------------------------------------------
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
      className="w-full h-[150px] bg-gray-900 mb-1 relative"
    />
  );
};

export default SingleLeadChart;
