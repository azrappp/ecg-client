import React from "react";

const UploadControls = ({
  onFileChange,
  onUpload,
  loading,
  hasFile,
  selectedModel, // <--- Props baru
  onModelChange, // <--- Props baru
}) => {
  // Theme constants
  const theme = {
    navy: "#1F3D68",
    blue: "#264B93",
    lightBlue: "#E4F5FC",
    border: "#1F3D6820",
  };

  return (
    <div
      className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-10px_rgba(31,61,104,0.15)] border mb-8 flex flex-col lg:flex-row gap-6 items-end transition-all hover:shadow-lg"
      style={{ borderColor: theme.border }}
    >
      {/* 1. File Input Section */}
      <div className="flex-1 w-full group">
        <label
          className="block text-sm font-bold mb-2 flex items-center gap-2"
          style={{ color: theme.navy }}
        >
          <svg
            className="w-4 h-4 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
          Select Signal File (.zip)
        </label>

        <div className="relative">
          <input
            type="file"
            onChange={onFileChange}
            accept=".zip"
            className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2.5 file:px-6
                file:rounded-full file:border-0
                file:text-sm file:font-bold
                file:cursor-pointer file:transition-all
                hover:file:scale-105 active:file:scale-95
                cursor-pointer rounded-xl border border-dashed border-slate-300
                bg-slate-50 py-3 pl-4 pr-4
                focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* 2. Model Selection Dropdown (NEW) */}
      <div className="w-full lg:w-64">
        <label
          className="block text-sm font-bold mb-2 flex items-center gap-2"
          style={{ color: theme.navy }}
        >
          <svg
            className="w-4 h-4 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          Select Model
        </label>
        <div className="relative">
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="block w-full appearance-none rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 text-sm font-medium text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
          >
            <option value="resnet">ResNet</option>
            <option value="cnn">CNN</option>
            <option value="attention">Attention Mechanism</option>
            <option value="multiscale">Multi-Scale CNN</option>
          </select>
          {/* Custom Arrow Icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Analyze Button */}
      <button
        onClick={onUpload}
        disabled={loading || !hasFile}
        style={{
          backgroundColor: loading || !hasFile ? "#94a3b8" : theme.blue,
          boxShadow:
            loading || !hasFile
              ? "none"
              : "0 4px 14px 0 rgba(38, 75, 147, 0.39)",
        }}
        className={`px-8 py-3 rounded-xl font-bold text-white transition-all transform h-[50px] flex items-center justify-center gap-2 min-w-[180px] w-full lg:w-auto
          ${
            loading || !hasFile
              ? "cursor-not-allowed opacity-70"
              : "hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-95"
          }`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <span>Analyze Signal</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </>
        )}
      </button>
    </div>
  );
};

export default UploadControls;
