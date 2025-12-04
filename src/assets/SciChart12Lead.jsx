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
  EThemeProviderType, // <--- 1. Import Enum Type Tema
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

const TRACE_COLOR = "#00FF00";
const BACKGROUND_COLOR = "#1c1c1e";

export const draw12LeadEcg = async (rootElement) => {
  // 2. PERBAIKAN DI SINI: Gunakan object { type: ... }
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      theme: { type: EThemeProviderType.Navy },
    }
  );

  // Set background manual agar lebih gelap sesuai keinginan
  sciChartSurface.background = BACKGROUND_COLOR;

  // 3. Setup X-Axis
  const xAxis = new CategoryAxis(wasmContext, {
    visibleRange: new NumberRange(0, POINTS_LOOP),
    isVisible: false,
  });
  sciChartSurface.xAxes.add(xAxis);

  // 4. Setup Layout Strategy
  sciChartSurface.layoutManager.rightOuterAxesLayoutStrategy =
    new RightAlignedOuterVerticallyStackedAxisLayoutStrategy();

  const dataSeriesRefs = [];

  // 5. LOOPING: Buat 12 Axis dan 12 Series
  LEAD_NAMES.forEach((leadName, index) => {
    // A. Buat Y-Axis
    const yAxis = new NumericAxis(wasmContext, {
      id: `yAxis_${leadName}`,
      visibleRange: new NumberRange(-1.5, 1.5),
      isVisible: false,
      autoRange: EAutoRange.Always,
      growBy: new NumberRange(0.1, 0.1),
    });

    sciChartSurface.yAxes.add(yAxis);

    // B. Buat Data Series
    const dataSeries = new XyDataSeries(wasmContext, {
      fifoCapacity: POINTS_LOOP,
      fifoSweeping: true,
      fifoSweepingGap: GAP_POINTS,
    });
    dataSeriesRefs.push(dataSeries);

    // C. Buat Renderable Series
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

  // 6. Fungsi Update Data
  const updateEcgData = (signalData) => {
    // Validasi data
    if (!Array.isArray(signalData)) return;

    signalData.forEach((leadValues, index) => {
      // Cek apakah dataSeries tersedia dan data lead ada
      if (dataSeriesRefs[index] && leadValues && leadValues.length > 0) {
        const xValues = Array.from({ length: leadValues.length }, (_, i) => i);
        dataSeriesRefs[index].clear();
        dataSeriesRefs[index].appendRange(xValues, leadValues);
      }
    });
  };

  return { sciChartSurface, controls: { updateEcgData } };
};
