import React, { useEffect, useState } from "react";
import { initLinkedCharts } from "./SciChartLinked";

const EcgDashboardLinked = () => {
  const [chartControls, setChartControls] = useState(null);
  const [prediction, setPrediction] = useState(null);

  // ID unik untuk 2 div
  const DIV_LEFT_ID = "chart-left-root";
  const DIV_RIGHT_ID = "chart-right-root";

  useEffect(() => {
    const setupCharts = async () => {
      const res = await initLinkedCharts(DIV_LEFT_ID, DIV_RIGHT_ID);
      setChartControls(res.controls);
    };
    setupCharts();
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (result.status === "success") {
        setPrediction(result);
        if (chartControls) {
          // Update kedua chart sekaligus
          chartControls.updateData(result.signal_data);
        }
      } else {
        alert("Gagal: " + result.detail);
      }
    } catch (error) {
      console.error(error);
      alert("Error koneksi API");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 20,
          color: "white",
          borderBottom: "1px solid #333",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>12-Lead ECG (Linked)</h2>
          <input
            type="file"
            onChange={handleUpload}
            style={{ marginTop: 10 }}
          />
        </div>
        {prediction && (
          <div style={{ textAlign: "right" }}>
            <h2 style={{ margin: 0, color: "#00FF00" }}>
              {prediction.prediction}
            </h2>
            <small>Confidence: {prediction.confidence}</small>
          </div>
        )}
      </div>

      {/* Container Chart: Grid 2 Kolom */}
      <div style={{ flex: 1, display: "flex", padding: 10, gap: 10 }}>
        {/* Kolom Kiri (Limb Leads) */}
        <div style={{ flex: 1, position: "relative" }}>
          <h4
            style={{
              color: "#888",
              position: "absolute",
              top: 0,
              left: 10,
              zIndex: 10,
            }}
          >
            Limb Leads (I - aVF)
          </h4>
          <div id={DIV_LEFT_ID} style={{ width: "100%", height: "100%" }}></div>
        </div>

        {/* Kolom Kanan (Chest Leads) */}
        <div style={{ flex: 1, position: "relative" }}>
          <h4
            style={{
              color: "#888",
              position: "absolute",
              top: 0,
              left: 10,
              zIndex: 10,
            }}
          >
            Chest Leads (V1 - V6)
          </h4>
          <div
            id={DIV_RIGHT_ID}
            style={{ width: "100%", height: "100%" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default EcgDashboardLinked;
