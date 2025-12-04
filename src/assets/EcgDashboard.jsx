import React, { useEffect, useState } from "react";
import { draw12LeadEcg } from "./SciChart12Lead";

const EcgDashboard = () => {
  const chartDivId = "ecg-chart-root";
  const [chartControls, setChartControls] = useState(null);
  const [prediction, setPrediction] = useState(null);

  // 1. Inisialisasi Chart saat pertama kali load
  useEffect(() => {
    const initChart = async () => {
      // Pastikan div sudah ada sebelum init
      const res = await draw12LeadEcg(chartDivId);
      setChartControls(res.controls);
    };
    initChart();
  }, []);

  // 2. Fungsi Upload & Panggil API
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Panggil API FastAPI
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (result.status === "success") {
        setPrediction(result);

        // Update Grafik jika kontrol chart sudah siap
        if (chartControls && result.signal_data) {
          chartControls.updateEcgData(result.signal_data);
        }
      } else {
        alert("Gagal memproses data");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan koneksi");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#000",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header / Toolbar */}
      <div
        style={{
          padding: "20px",
          color: "white",
          borderBottom: "1px solid #333",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 10px 0" }}>ECG 12-Lead Monitor</h2>
          <input
            type="file"
            onChange={handleUpload}
            style={{ color: "white" }}
          />
        </div>

        {/* Tampilkan Hasil Prediksi */}
        {prediction && (
          <div style={{ textAlign: "right" }}>
            <h2 style={{ margin: 0, color: "#FFFF00", fontSize: "2rem" }}>
              {prediction.prediction}
            </h2>
            <div style={{ color: "#00FFFF", fontSize: "1.2rem" }}>
              Confidence: {prediction.confidence}
            </div>
          </div>
        )}
      </div>

      {/* Area Chart */}
      <div
        id={chartDivId}
        style={{ flex: 1, width: "100%", position: "relative" }}
      />
    </div>
  );
};

export default EcgDashboard;
