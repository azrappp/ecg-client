import {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  NumberRange,
  EllipsePointMarker,
  ZoomPanModifier,
  MouseWheelZoomModifier,
  ZoomExtentsModifier,
} from "scichart";
import { SciChartJSDarkTheme } from "scichart/Charting/Themes/SciChartJSDarkTheme";
// Warna grafik (Biru Muda)
const ECG_COLOR = "#50C7E0";

/**
 * Fungsi untuk menggambar grafik ECG
 * @param {string|HTMLDivElement} rootElement - ID atau referensi div
 * @param {number[]} ecgDataValues - Array data sinyal (satu lead)
 */
export const drawEcgChart = async (rootElement, ecgDataValues) => {
  // 1. Setup Surface
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      theme: new SciChartJSDarkTheme(),
    }
  );

  // 2. Setup Sumbu X (Index/Waktu)
  const xAxis = new NumericAxis(wasmContext, {
    axisTitle: "Index / Time",
    visibleRange: new NumberRange(0, ecgDataValues.length),
  });

  // 3. Setup Sumbu Y (Amplitudo)
  const yAxis = new NumericAxis(wasmContext, {
    axisTitle: "Amplitude (mV)",
    autoRange: "Always",
  });

  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);

  // 4. Siapkan Data (X dan Y)
  // Buat array index [0, 1, 2, ...] sepanjang data Y
  const xValues = ecgDataValues.map((_, index) => index);
  const yValues = ecgDataValues;

  const dataSeries = new XyDataSeries(wasmContext, {
    dataSeriesName: "ECG Signal",
    xValues,
    yValues,
  });

  // 5. Setup Garis Grafik
  const lineSeries = new FastLineRenderableSeries(wasmContext, {
    dataSeries: dataSeries,
    stroke: ECG_COLOR,
    strokeThickness: 2,
    pointMarker: new EllipsePointMarker(wasmContext, {
      width: 5,
      height: 5,
      strokeThickness: 0,
      fill: ECG_COLOR,
      lastPointOnly: true,
    }),
  });

  sciChartSurface.renderableSeries.add(lineSeries);

  // 6. Tambahkan Fitur Zoom & Geser
  sciChartSurface.chartModifiers.add(
    new ZoomPanModifier(),
    new MouseWheelZoomModifier(),
    new ZoomExtentsModifier()
  );

  return { sciChartSurface };
};
