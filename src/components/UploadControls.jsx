import React from "react";

const UploadControls = ({ onFileChange, onUpload, loading, hasFile }) => {
  // Theme constants to match your chart and report
  const theme = {
    navy: "#1F3D68",
    blue: "#264B93",
    lightBlue: "#E4F5FC",
    border: "#1F3D6820",
  };

  return (
    <div
      className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-10px_rgba(31,61,104,0.15)] border mb-8 flex flex-col md:flex-row gap-6 items-end transition-all hover:shadow-lg"
      style={{ borderColor: theme.border }}
    >
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
            style={
              {
                // Inline styles for theme colors that Tailwind might not have
                // We use a CSS variable trick or just set color in class,
                // but for file inputs, standard classes are often easier.
                // Here we override the file button background:
              }
            }
          />
          {/* Visual hint for empty state */}
          {!hasFile && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 md:opacity-100 transition-opacity group-hover:opacity-100">
              <span className="text-xs text-slate-400 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">
                Drag & Drop supported
              </span>
            </div>
          )}
        </div>
      </div>

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
        className={`px-8 py-3 rounded-xl font-bold text-white transition-all transform h-[50px] flex items-center justify-center gap-2 min-w-[180px]
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
