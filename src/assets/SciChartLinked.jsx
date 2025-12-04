import {
  SciChartSurface,
  NumericAxis,
  XyDataSeries,
  FastLineRenderableSeries,
  SciChartVerticalGroup,
  CategoryAxis,
  NumberRange,
  RightAlignedOuterVerticallyStackedAxisLayoutStrategy,
  EllipsePointMarker,
  RolloverModifier,
  ZoomPanModifier,
  MouseWheelZoomModifier,
  ZoomExtentsModifier,
  EThemeProviderType,
  EAutoRange,
} from "scichart";

// Konfigurasi
const POINTS_LOOP = 1200;
const GAP_POINTS = 50;
const STROKE_THICKNESS = 2;
const TRACE_COLOR = "#00FF00"; // Hijau Medis
const BACKGROUND_COLOR = "#1c1c1e";

// Kita bagi 12 Lead menjadi 2 Grup
const LEADS_GROUP_1 = ["I", "II", "III", "aVR", "aVL", "aVF"];
const LEADS_GROUP_2 = ["V1", "V2", "V3", "V4", "V5", "V6"];

// Fungsi Helper untuk membuat satu chart (Reuse code)
const createSingleChart = async (divId, leadNames) => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId, {
    theme: { type: EThemeProviderType.Navy },
  });

  sciChartSurface.background = BACKGROUND_COLOR;

  // X Axis (Hidden)
  const xAxis = new CategoryAxis(wasmContext, {
    visibleRange: new NumberRange(0, POINTS_LOOP),
    isVisible: false,
  });
  sciChartSurface.xAxes.add(xAxis);

  // Layout Strategy (Stacked ke bawah)
  sciChartSurface.layoutManager.rightOuterAxesLayoutStrategy =
    new RightAlignedOuterVerticallyStackedAxisLayoutStrategy();

  const dataSeriesRefs = [];

  // Loop membuat Axis & Series untuk Lead di grup ini
  leadNames.forEach((leadName) => {
    // Y Axis
    const yAxis = new NumericAxis(wasmContext, {
      id: `yAxis_${leadName}`,
      visibleRange: new NumberRange(-2, 2),
      isVisible: false,
      autoRange: EAutoRange.Always,
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
      yAxisId: yAxis.id,
      stroke: TRACE_COLOR,
      strokeThickness: STROKE_THICKNESS,
      dataSeries: dataSeries,
      pointMarker: new EllipsePointMarker(wasmContext, {
        width: 5,
        height: 5,
        fill: TRACE_COLOR,
        strokeThickness: 0,
        lastPointOnly: true,
      }),
    });

    // Konfigurasi Tooltip agar muncul nama Lead
    renderableSeries.rolloverModifierProps.tooltipTitle = leadName;
    renderableSeries.rolloverModifierProps.tooltipColor = "green";

    sciChartSurface.renderableSeries.add(renderableSeries);
  });

  // Tambahkan Modifiers (Zoom, Pan, Tooltip)
  // PENTING: Set modifierGroup agar event mouse disharing antar chart!
  const modifierGroup = "ECG_LINKED_GROUP";

  sciChartSurface.chartModifiers.add(
    new RolloverModifier({ modifierGroup }),
    new ZoomPanModifier({ modifierGroup }),
    new MouseWheelZoomModifier({ modifierGroup }),
    new ZoomExtentsModifier({ modifierGroup })
  );

  return { sciChartSurface, dataSeriesRefs, xAxis };
};

export const initLinkedCharts = async (divIdLeft, divIdRight) => {
  // 1. Buat 2 Chart secara paralel
  const [chartLeft, chartRight] = await Promise.all([
    createSingleChart(divIdLeft, LEADS_GROUP_1),
    createSingleChart(divIdRight, LEADS_GROUP_2),
  ]);

  // 2. LINKING: Sinkronisasi Lebar Chart (Vertical Group)
  // Ini memastikan area gambar grafik kiri & kanan lebarnya sama persis
  const verticalGroup = new SciChartVerticalGroup();
  verticalGroup.addSurfaceToGroup(chartLeft.sciChartSurface);
  verticalGroup.addSurfaceToGroup(chartRight.sciChartSurface);

  // 3. LINKING: Sinkronisasi Zoom (Visible Range)
  // Jika chart kiri di-zoom, chart kanan ikut, dan sebaliknya
  chartLeft.xAxis.visibleRangeChanged.subscribe((args) => {
    chartRight.xAxis.visibleRange = args.visibleRange;
  });
  chartRight.xAxis.visibleRangeChanged.subscribe((args) => {
    chartLeft.xAxis.visibleRange = args.visibleRange;
  });

  // 4. Fungsi Update Data Gabungan
  const updateData = (allSignalData) => {
    if (!allSignalData) return;

    // Masukkan data 0-5 ke Chart Kiri
    LEADS_GROUP_1.forEach((_, i) => {
      const leadData = allSignalData[i];
      if (leadData) {
        const xValues = Array.from({ length: leadData.length }, (_, k) => k);
        chartLeft.dataSeriesRefs[i].clear();
        chartLeft.dataSeriesRefs[i].appendRange(xValues, leadData);
      }
    });

    // Masukkan data 6-11 ke Chart Kanan
    LEADS_GROUP_2.forEach((_, i) => {
      const globalIndex = i + 6; // Offset index untuk grup kedua
      const leadData = allSignalData[globalIndex];
      if (leadData) {
        const xValues = Array.from({ length: leadData.length }, (_, k) => k);
        chartRight.dataSeriesRefs[i].clear();
        chartRight.dataSeriesRefs[i].appendRange(xValues, leadData);
      }
    });
  };

  return {
    leftSurface: chartLeft.sciChartSurface,
    rightSurface: chartRight.sciChartSurface,
    controls: { updateData },
  };
};
