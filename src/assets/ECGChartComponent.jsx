import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  NumberRange,
  SciChartVerticalGroup,
  ZoomPanModifier,
  MouseWheelZoomModifier,
  ZoomExtentsModifier,
  RolloverModifier,
  SciChartJSDarkTheme,
} from "scichart";

// Standard 12-Lead ECG Labels
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
const SYNC_GROUP_ID = "ECG_SYNC_GROUP";
const CHART_HEIGHT = 150; // Height per lead in pixels

// --- SUB-COMPONENT: Single Lead Chart ---
// --- SUB-COMPONENT: Single Lead Chart ---
const SingleLeadChart = ({
  data,
  leadIndex,
  verticalGroup,
  xVisibleRange,
  onXRangeChange,
}) => {
  const chartDivRef = useRef(null);

  useEffect(() => {
    // 1. Track if the component is unmounted to prevent race conditions
    let isUnmounted = false;
    let sciChartSurfaceInstance = null;

    const init = async () => {
      try {
        // Create the surface
        const res = await SciChartSurface.create(chartDivRef.current, {
          theme: new SciChartJSDarkTheme(),
        });

        // If component unmounted while awaiting, delete immediately and exit
        if (isUnmounted) {
          res.sciChartSurface.delete();
          return;
        }

        sciChartSurfaceInstance = res.sciChartSurface;
        const { sciChartSurface, wasmContext } = res;

        // 2. Add to Vertical Group
        if (verticalGroup) {
          verticalGroup.addSurfaceToGroup(sciChartSurface);
        }

        // 3. Create Axes
        const xAxis = new NumericAxis(wasmContext, {
          visibleRange: xVisibleRange,
          drawMajorGridLines: true,
          drawMinorGridLines: false,
          axisTitle: leadIndex === 11 ? "Time (samples)" : "",
        });

        const yAxis = new NumericAxis(wasmContext, {
          autoRange: "Always",
          drawMajorGridLines: true,
          drawMinorGridLines: false,
          axisTitle: LEAD_NAMES[leadIndex] || `Lead ${leadIndex + 1}`,
        });

        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);

        // 4. Create Data Series
        const xValues = data.map((_, i) => i);
        const yValues = data;
        const dataSeries = new XyDataSeries(wasmContext, { xValues, yValues });

        // 5. Renderable Series
        const lineSeries = new FastLineRenderableSeries(wasmContext, {
          dataSeries,
          stroke: "#50C7E0",
          strokeThickness: 2,
        });
        sciChartSurface.renderableSeries.add(lineSeries);

        // 6. Modifiers
        sciChartSurface.chartModifiers.add(
          new ZoomPanModifier({
            enableZoom: true,
            mouseEventGroup: SYNC_GROUP_ID,
          }),
          new MouseWheelZoomModifier({ mouseEventGroup: SYNC_GROUP_ID }),
          new ZoomExtentsModifier({ mouseEventGroup: SYNC_GROUP_ID }),
          new RolloverModifier({
            mouseEventGroup: SYNC_GROUP_ID,
            showTooltip: true,
            tooltipDataTemplate: (seriesInfo) => [
              `X: ${seriesInfo.xValue.toFixed(0)}`,
              `Y: ${seriesInfo.yValue.toFixed(4)}`,
            ],
          })
        );
      } catch (err) {
        console.error("SciChart Init Error:", err);
      }
    };

    init();

    // CLEANUP FUNCTION
    return () => {
      isUnmounted = true;
      // If the chart exists, delete it to free the WebGL context
      if (sciChartSurfaceInstance) {
        if (verticalGroup) {
          verticalGroup.removeSurfaceFromGroup(sciChartSurfaceInstance);
        }
        sciChartSurfaceInstance.delete();
        sciChartSurfaceInstance = null;
      }
    };
  }, [data, leadIndex, verticalGroup]);
  // removed xVisibleRange from dependency to prevent unnecessary re-initialization

  return (
    <div
      id={`ecg-chart-${leadIndex}`} // Good practice to have unique IDs
      ref={chartDivRef}
      style={{
        width: "100%",
        height: `${CHART_HEIGHT}px`,
        marginBottom: "4px",
      }}
    />
  );
};

// --- MAIN COMPONENT ---
const EcgAnalysisApp = () => {
  const [file, setFile] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync Helpers
  // 1. SciChartVerticalGroup ensures the Y-Axis labels are the same width so charts align left-to-right
  const verticalGroup = useMemo(() => new SciChartVerticalGroup(), []);

  // 2. Shared X Range Object to pass to all charts
  const [sharedXRange] = useState(new NumberRange(0, 1000));

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a .zip file first");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file); // Matches -F 'file=@...'

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
        // Content-Type header is set automatically by fetch when using FormData
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }

      const result = await response.json();
      setApiData(result);

      // Update initial range based on first lead length
      if (result.signal_data && result.signal_data.length > 0) {
        sharedXRange.min = 0;
        sharedXRange.max = result.signal_data[0].length;
      }
    } catch (err) {
      console.error(err);
      setError(err.message);

      // --- FALLBACK FOR DEMO (If API is offline) ---
      // remove this block in production
      console.warn("Generating Mock Data for Demo...");
      const mockData = {
        status: "mock_success",
        filename: file.name,
        prediction: "STTC",
        confidence: "88.5%",
        probabilities: { STTC: 0.885, NORM: 0.1 },
        // Generate 12 leads of random noise + sine waves
        signal_data: Array.from({ length: 12 }, (_, leadIdx) =>
          Array.from(
            { length: 2000 },
            (_, i) => Math.sin(i * 0.05 + leadIdx) + Math.random() * 0.2
          )
        ),
      };
      setApiData(mockData);
      // ---------------------------------------------
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">
            12-Lead ECG Analyzer
          </h1>
          <p className="text-gray-400">
            Upload a zip file containing ECG signal data to visualize all 12
            leads.
          </p>
        </header>

        {/* Controls Section */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Signal File (.zip)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700
                cursor-pointer bg-gray-900 rounded border border-gray-700"
            />
          </div>
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`px-6 py-2 rounded font-semibold transition-colors h-10 ${
              loading || !file
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Processing..." : "Analyze Signal"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded mb-6">
            Error: {error}
          </div>
        )}

        {/* Results Section */}
        {apiData && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Panel: Charts */}
            <div className="lg:col-span-3 bg-gray-950 p-4 rounded-lg border border-gray-800 shadow-inner">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-300">
                  Signal Visualizer
                </h3>
                <span className="text-xs text-gray-500">
                  Hold Left Click to Pan • Wheel to Zoom • Double Click to Reset
                </span>
              </div>

              <div className="space-y-1">
                {apiData.signal_data.map((signal, index) => (
                  <SingleLeadChart
                    key={index}
                    leadIndex={index}
                    data={signal}
                    verticalGroup={verticalGroup} // Passed for axis width sync
                    xVisibleRange={sharedXRange} // Passed for logic sync
                  />
                ))}
              </div>
            </div>

            {/* Right Panel: Analysis Stats */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 sticky top-6">
                <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-600 pb-2">
                  Analysis Report
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase">
                      Primary Prediction
                    </label>
                    <div className="text-3xl font-bold text-green-400">
                      {apiData.prediction}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 uppercase">
                      Confidence
                    </label>
                    <div className="text-xl text-white">
                      {apiData.confidence}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 uppercase">
                      Beats Detected
                    </label>
                    <div className="text-lg text-white">
                      {apiData.total_beats_detected || "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 uppercase mb-2 block">
                      Probabilities
                    </label>
                    <div className="space-y-2">
                      {apiData.probabilities &&
                        Object.entries(apiData.probabilities).map(
                          ([key, val]) => (
                            <div
                              key={key}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-gray-300">{key}</span>
                              <span className="font-mono text-blue-300">
                                {(val * 100).toFixed(2)}%
                              </span>
                            </div>
                          )
                        )}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-700">
                    <label className="text-xs text-gray-500">Filename</label>
                    <div className="text-xs text-gray-400 break-all">
                      {apiData.filename}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcgAnalysisApp;
