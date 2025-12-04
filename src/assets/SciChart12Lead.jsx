import {
  CategoryAxis,
  EllipsePointMarker,
  FastLineRenderableSeries,
  NumberRange,
  NumericAxis,
  RightAlignedOuterVerticallyStackedAxisLayoutStrategy,
  SciChartSurface,
  XyDataSeries,
  EAutoRange,
  EThemeProviderType,
} from "scichart";

// Konstanta Konfigurasi
const POINTS_LOOP = 1200;
const GAP_POINTS = 50;
const STROKE_THICKNESS = 2;

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

const TRACE_COLOR = "#00FF00"; // Hijau Neon
const BACKGROUND_COLOR = "#1c1c1e";

export const draw12LeadEcg = async (rootElement) => {
  // 1. Setup Surface
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      theme: { type: EThemeProviderType.Navy },
    }
  );

  sciChartSurface.background = BACKGROUND_COLOR;

  // 2. Setup X-Axis
  const xAxis = new CategoryAxis(wasmContext, {
    visibleRange: new NumberRange(0, POINTS_LOOP),
    isVisible: false,
  });
  sciChartSurface.xAxes.add(xAxis);

  // 3. Setup Layout Strategy (STACKED VERTICAL)
  sciChartSurface.layoutManager.rightOuterAxesLayoutStrategy =
    new RightAlignedOuterVerticallyStackedAxisLayoutStrategy();

  const dataSeriesRefs = [];

  // 4. LOOPING: Buat 12 Axis dan 12 Series
  LEAD_NAMES.forEach((leadName, index) => {
    // Y-Axis
    const yAxis = new NumericAxis(wasmContext, {
      id: `yAxis_${leadName}`,
      visibleRange: new NumberRange(-2.0, 2.0), // Range Default diperbesar sedikit
      isVisible: false,
      autoRange: EAutoRange.Always, // PENTING: Agar grafik tidak gepeng
      growBy: new NumberRange(0.1, 0.1),
    });
    sciChartSurface.yAxes.add(yAxis);

    // Data Series
    const dataSeries = new XyDataSeries(wasmContext, {
      fifoCapacity: POINTS_LOOP,
      fifoSweeping: true,
      fifoSweepingGap: GAP_POINTS,
    });
    dataSeriesRefs.push(dataSeries);

    // Renderable Series
    const renderableSeries = new FastLineRenderableSeries(wasmContext, {
      yAxisId: `yAxis_${leadName}`,
      strokeThickness: STROKE_THICKNESS,
      stroke: TRACE_COLOR,
      dataSeries: dataSeries,
      pointMarker: new EllipsePointMarker(wasmContext, {
        width: 5,
        height: 5,
        strokeThickness: 0,
        fill: TRACE_COLOR,
        lastPointOnly: true,
      }),
    });

    sciChartSurface.renderableSeries.add(renderableSeries);
  });

  // 5. Fungsi Update Data (DIPERBAIKI)
  const updateEcgData = (signalData) => {
    console.log("SciChart: Menerima Data...", signalData); // DEBUG

    if (!Array.isArray(signalData)) return;

    signalData.forEach((leadValues, index) => {
      if (dataSeriesRefs[index] && leadValues && leadValues.length > 0) {
        const xValues = Array.from({ length: leadValues.length }, (_, i) => i);

        // Masukkan Data
        dataSeriesRefs[index].clear();
        dataSeriesRefs[index].appendRange(xValues, leadValues);
      }
    });

    // PENTING: Paksa kamera untuk melihat data (Zoom Extents)
    sciChartSurface.zoomExtents();
  };

  return { sciChartSurface, controls: { updateEcgData } };
};
