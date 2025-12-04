import React, { useEffect, useState } from "react";
import { draw12LeadEcg } from "./SciChart12Lead";

const EcgDashboard = () => {
  const chartDivId = "ecg-chart-root";
  const [chartControls, setChartControls] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initChart = async () => {
      try {
        const res = await draw12LeadEcg(chartDivId);
        setChartControls(res.controls);
      } catch (err) {
        console.error("SciChart Error:", err);
      }
    };
    initChart();
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      console.log("API Result:", result); // Cek Console browser

      if (result.status === "success") {
        setPrediction(result);

        // Panggil fungsi update grafik
        if (chartControls && result.signal_data) {
          console.log("Mengupdate grafik dengan data...");
          chartControls.updateEcgData(result.signal_data);
        } else {
          console.error("Chart Controls belum siap!");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#000",
        color: "#fff",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 20px",
          borderBottom: "1px solid #333",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3>12-Lead ECG</h3>
          <input type="file" onChange={handleUpload} disabled={isLoading} />
        </div>
        {prediction && (
          <div style={{ textAlign: "right" }}>
            <h2 style={{ margin: 0, color: "#0f0" }}>
              {prediction.prediction}
            </h2>
            <small>Confidence: {prediction.confidence}</small>
          </div>
        )}
      </div>

      {/* PENTING: Container Grafik 
         Pastikan 'flex: 1' agar dia mengisi sisa layar.
         Dan Div di dalamnya punya height: 100%.
      */}
      <div style={{ flex: 1, position: "relative", minHeight: "0" }}>
        <div id={chartDivId} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};

export default EcgDashboard;
