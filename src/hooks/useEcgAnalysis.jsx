import { useState } from "react";

export const useEcgAnalysis = () => {
  const [file, setFile] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // Reset data lama jika user ganti file
      setApiData(null);
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
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }

      const result = await response.json();
      setApiData(result);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    file,
    apiData,
    loading,
    error,
    handleFileChange,
    analyzeSignal,
  };
};
