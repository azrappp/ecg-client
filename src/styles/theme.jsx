import { SciChartJSLightTheme } from "scichart";

// Define the custom theme based on the code you provided
export const customTheme = {
  ...new SciChartJSLightTheme(),
  axisBandsFill: "#83D2F511",
  axisBorder: "#1F3D68",
  gridBackgroundBrush: "white",
  gridBorderBrush: "white",
  loadingAnimationForeground: "#6495ED77",
  loadingAnimationBackground: "#E4F5FC",
  majorGridLineBrush: "#264B9322",
  minorGridLineBrush: "#264B9306",
  sciChartBackground: "#E4F5FC",
  tickTextBrush: "#1F3D68",
  axisTitleColor: "#1F3D68",
  // These are the colors that 'stroke: "auto"' will pick from
  strokePalette: ["#264B93", "#A16DAE", "#C52E60"],
  fillPalette: ["#264B9333", "#A16DAE33", "#C52E6033"],
};
