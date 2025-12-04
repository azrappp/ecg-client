import { SciChartReact } from "scichart-react";
import { ESeriesType, EThemeProviderType } from "scichart";

/**
 * The chart configuration object acceptable by the Builder API
 * @type {import("scichart").TSurfaceDefinition}
 */
const chartConfig = {
  surface: {
    theme: { type: EThemeProviderType.Dark },
    title: "Basic Chart via Config",
    titleStyle: {
      fontSize: 20,
    },
  },
  series: {
    type: ESeriesType.SplineMountainSeries,
    options: {
      strokeThickness: 4,
      stroke: "#216939",
      fillLinearGradient: {
        startPoint: { x: 0, y: 0 },
        endPoint: { x: 1, y: 1 },
        gradientStops: [
          { offset: 0.3, color: "#2d2169" },
          { offset: 1, color: "transparent" },
        ],
      },
    },
    xyData: { xValues: [0, 1, 2, 3, 4], yValues: [3, 6, 1, 5, 2] },
  },
};

export const BasicChart = () => (
  <SciChartReact style={{ width: 400, height: 300 }} config={chartConfig} />
);
