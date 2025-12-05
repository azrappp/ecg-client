import React from "react";
import NavbarECG from "../components/NavbarECG";
import UploadControls from "../components/UploadControls";
import SignalVisualizer from "../components/SignalVisualizer";
import AnalysisReport from "../components/AnalysisReport";
import { useEcgAnalysis } from "../hooks/useEcgAnalysis";

const EcgDashboard = () => {
  const { file, apiData, loading, error, handleFileChange, analyzeSignal } =
    useEcgAnalysis();

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header (Bisa dibuat komponen terpisah atau inline) */}
        <NavbarECG />

        {/* Controls */}
        <UploadControls
          onFileChange={handleFileChange}
          onUpload={analyzeSignal}
          loading={loading}
          hasFile={!!file}
        />

        {/* Error State */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded mb-6">
            Error: {error}
          </div>
        )}

        {/* Main Content Area */}
        {apiData && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <SignalVisualizer signalData={apiData.signal_data} />
            <AnalysisReport apiData={apiData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EcgDashboard;
