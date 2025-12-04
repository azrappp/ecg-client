import React, { useEffect, useRef, useState } from "react";
import { SciChartSurface } from "scichart"; // Import ini diperlukan untuk setup awal CDN jika belum
import { drawEcgChart } from "./drawECG";

// Setup CDN sekali saja (jika Anda pakai cara CDN)
SciChartSurface.useWasmFromCDN();

const EcgChartComponent = () => {
  const chartDivRef = useRef(null);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fungsi Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      // --- LOGIKA FETCH API ---
      // const response = await fetch('http://localhost:8000/predict', { method: 'POST', ... });
      // const result = await response.json();

      // --- CONTOH MOCK DATA (Sesuai JSON Anda) ---
      // Saya membuat dummy data random untuk simulasi visualisasi
      const dummySignal = Array.from(
        { length: 1000 },
        () => Math.random() * 0.1 - 0.05
      );

      const mockResponse = {
        status: "success",
        filename: "13000_lr.zip",
        total_beats_detected: 10,
        prediction: "STTC",
        confidence: "65.48%",
        probabilities: { STTC: 0.65 },
        // Struktur signal_data biasanya array of arrays (Misal 12 lead)
        // [ [Lead I data...], [Lead II data...], ... ]
        signal_data: [
          dummySignal, // Lead 1 (Index 0)
        ],
      };

      setApiData(mockResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let sciChartSurface = null;

    const initChart = async () => {
      // Pastikan div ada dan data sudah tersedia
      if (
        chartDivRef.current &&
        apiData &&
        apiData.signal_data &&
        apiData.signal_data.length > 0
      ) {
        // Ambil Lead I (Index ke-0)
        // Jika Anda ingin menampilkan lead lain, ubah indexnya (misal [1] untuk Lead II)
        const lead1Data = apiData.signal_data[0];

        const res = await drawEcgChart(chartDivRef.current, lead1Data);
        sciChartSurface = res.sciChartSurface;
      }
    };

    initChart();

    // Cleanup function sangat penting di React + SciChart
    // agar tidak memory leak saat pindah halaman/refresh komponen
    return () => {
      if (sciChartSurface) {
        sciChartSurface.delete();
      }
    };
  }, [apiData]);

  return (
    <div
      style={{
        width: "100%",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>Analisis ECG</h2>

      {loading && <p>Mengambil data...</p>}

      {/* Container Grafik */}
      <div
        ref={chartDivRef}
        style={{
          width: "100%",
          height: "500px",
          backgroundColor: "#1c1c1e",
          borderRadius: "8px",
        }}
      />

      {/* Menampilkan Info Prediksi */}
      {apiData && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h3>
            Hasil Prediksi:{" "}
            <span style={{ color: "red" }}>{apiData.prediction}</span>
          </h3>
          <p>
            <strong>Confidence:</strong> {apiData.confidence}
          </p>
          <p>
            <strong>Beats Detected:</strong> {apiData.total_beats_detected}
          </p>
          <p>
            <strong>Filename:</strong> {apiData.filename}
          </p>
        </div>
      )}
    </div>
  );
};

export default EcgChartComponent;
