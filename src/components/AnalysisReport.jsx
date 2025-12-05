import React from "react";

const AnalysisReport = ({ apiData }) => {
  if (!apiData) return null;

  return (
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
            <div className="text-xl text-white">{apiData.confidence}</div>
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
                Object.entries(apiData.probabilities).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-300">{key}</span>
                    <span className="font-mono text-blue-300">
                      {(val * 100).toFixed(2)}%
                    </span>
                  </div>
                ))}
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
  );
};

export default AnalysisReport;
