import { useState, useEffect } from "react";

export const useEcgAnalysis = () => {
  const [file, setFile] = useState(null);
  // Cek localStorage saat pertama kali load
  const [apiData, setApiData] = useState(() => {
    const savedData = localStorage.getItem("lastEcgAnalysis");
    return savedData ? JSON.parse(savedData) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State baru untuk pemilihan model (Default: resnet)
  const [selectedModel, setSelectedModel] = useState("resnet");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // KITA TIDAK RESET apiData DISINI
      // Agar user masih bisa lihat data lama sampai mereka klik "Analyze"
      setError(null);
    }
  };

  const analyzeSignal = async () => {
    if (!file) {
      alert("Please select a .zip file first");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Update URL dengan Query Param model_name
      const response = await fetch(
        `http://localhost:8000/predict?model_name=${selectedModel}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }

      const result = await response.json();

      // 1. Simpan ke State
      setApiData(result);

      // 2. Simpan ke LocalStorage (Cache)
      try {
        localStorage.setItem("lastEcgAnalysis", JSON.stringify(result));
      } catch (storageError) {
        console.warn(
          "Gagal menyimpan ke LocalStorage (Mungkin file terlalu besar):",
          storageError
        );
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi helper jika user ingin membersihkan data manual
  const clearData = () => {
    setApiData(null);
    setFile(null);
    localStorage.removeItem("lastEcgAnalysis");
  };

  return {
    file,
    apiData,
    loading,
    error,
    selectedModel, // <--- Return state model
    setSelectedModel, // <--- Return setter model
    handleFileChange,
    analyzeSignal,
    clearData, // <--- Opsional
  };
};
