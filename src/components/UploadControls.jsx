import React from "react";

const UploadControls = ({ onFileChange, onUpload, loading, hasFile }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-8 flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Signal File (.zip)
        </label>
        <input
          type="file"
          onChange={onFileChange}
          accept=".zip"
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
        onClick={onUpload}
        disabled={loading || !hasFile}
        className={`px-6 py-2 rounded font-semibold transition-colors h-10 ${
          loading || !hasFile
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {loading ? "Processing..." : "Analyze Signal"}
      </button>
    </div>
  );
};

export default UploadControls;
