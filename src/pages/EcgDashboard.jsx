import React from "react";
import NavbarECG from "../components/NavbarECG";
import UploadControls from "../components/UploadControls";
import SignalVisualizer from "../components/SignalVisualizer";
import AnalysisReport from "../components/AnalysisReport";
import { useEcgAnalysis } from "../hooks/useEcgAnalysis";

const EcgDashboard = () => {
  const {
    file,
    apiData,
    loading,
    error,
    handleFileChange,
    analyzeSignal,
    selectedModel, // <--- Ambil state
    setSelectedModel, // <--- Ambil setter
  } = useEcgAnalysis();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-900">
      <NavbarECG />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Controls Section */}
        <section className="mb-8">
          <UploadControls
            onFileChange={handleFileChange}
            onUpload={analyzeSignal}
            loading={loading}
            hasFile={!!file}
            selectedModel={selectedModel} // <--- Pass ke component
            onModelChange={setSelectedModel} // <--- Pass ke component
          />
        </section>

        {/* Error Notification */}
        {error && (
          <div className="mb-8 rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
            <svg
              className="w-5 h-5 text-red-500 mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-bold text-red-800">
                Processing Error
              </h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Data Visualization Grid */}
        {apiData && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start animate-in fade-in duration-500">
            {/* Left Column: Signal Visualizer */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white p-1 rounded-2xl shadow-[0_4px_20px_-10px_rgba(31,61,104,0.15)] border border-slate-100">
                <SignalVisualizer signalData={apiData.signal_data} />
              </div>
            </div>

            {/* Right Column: Analysis Report */}
            <div className="lg:col-span-1">
              <AnalysisReport apiData={apiData} />
            </div>
          </div>
        )}

        {/* Empty State / Placeholder */}
        {!apiData && !loading && !error && (
          <div className="text-center py-20 opacity-40">
            <div className="inline-block p-6 rounded-full bg-slate-100 mb-4">
              <svg
                className="w-12 h-12 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-600">
              No Signal Data Loaded
            </h3>
            <p className="text-slate-500">
              {/* Pesan sedikit diubah agar user tau bisa pakai data lama */}
              Select a model and upload a ZIP file to view ECG analysis. <br />
              Previous analysis will be saved automatically.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default EcgDashboard;
