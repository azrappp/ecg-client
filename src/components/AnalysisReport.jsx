import React from "react";

const AnalysisReport = ({ apiData }) => {
  if (!apiData) return null;

  // Theme constants based on your SciChart CustomTheme
  const theme = {
    navy: "#1F3D68", // axisTitleColor / tickTextBrush
    blue: "#264B93", // strokePalette[0]
    lightBlue: "#E4F5FC", // sciChartBackground
    border: "#1F3D6820", // Low opacity navy for borders
  };

  return (
    <div className="lg:col-span-1 space-y-6">
      <div
        className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-10px_rgba(31,61,104,0.15)] border sticky top-6 backdrop-blur-sm"
        style={{ borderColor: theme.border }}
      >
        {/* Header */}
        <div
          className="mb-6 pb-4 border-b"
          style={{ borderColor: theme.border }}
        >
          <h3
            className="text-xl font-bold flex items-center gap-2"
            style={{ color: theme.navy }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Analysis Report
          </h3>
        </div>

        <div className="space-y-6">
          {/* Primary Prediction Block */}
          <div
            className="p-4 rounded-xl text-center transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: theme.lightBlue }}
          >
            <label
              className="text-xs font-semibold tracking-wider uppercase opacity-70 mb-1 block"
              style={{ color: theme.navy }}
            >
              Primary Prediction
            </label>
            <div
              className="text-4xl font-black tracking-tight"
              style={{ color: theme.blue }}
            >
              {apiData.prediction}
            </div>
            <div
              className="text-sm font-medium mt-1 opacity-80"
              style={{ color: theme.navy }}
            >
              {apiData.confidence} Confidence
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid">
            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50">
              <label className="text-xs text-gray-500 uppercase block mb-1">
                Beats Detected
              </label>
              <div className="text-lg font-bold" style={{ color: theme.navy }}>
                {apiData.total_beats_detected || "0"}
              </div>
            </div>
          </div>

          {/* Probabilities Section */}
          <div>
            <label
              className="text-xs font-bold uppercase mb-3 block flex justify-between"
              style={{ color: theme.navy }}
            >
              <span>Class Probabilities</span>
              <span className="opacity-50">AI Model Output</span>
            </label>

            <div className="space-y-3">
              {apiData.probabilities &&
                Object.entries(apiData.probabilities)
                  // Sort by highest probability first
                  .sort(([, a], [, b]) => b - a)
                  .map(([key, val]) => {
                    const percentage = val * 100;
                    const isDominant = key === apiData.prediction;

                    return (
                      <div key={key} className="group">
                        <div className="flex justify-between text-sm mb-1">
                          <span
                            className={`font-medium ${
                              isDominant ? "font-bold" : ""
                            }`}
                            style={{ color: theme.navy }}
                          >
                            {key}
                          </span>
                          <span className="font-mono text-slate-500 text-xs">
                            {percentage.toFixed(2)}%
                          </span>
                        </div>
                        {/* Progress Bar Container */}
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          {/* Animated Fill */}
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: isDominant
                                ? theme.blue
                                : "#94a3b8", // Blue for winner, gray for others
                              opacity: isDominant ? 1 : 0.5,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>

          {/* Footer File Info */}
          <div
            className="pt-4 mt-2 border-t border-dashed"
            style={{ borderColor: theme.border }}
          >
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <svg
                className="w-4 h-4 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <div className="break-all font-mono opacity-70">
                {apiData.filename}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
