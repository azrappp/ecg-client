import React, { useEffect, useRef } from "react";
import {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  SciChartJsTheme,
  NumberRange,
  RightAlignedOuterVerticallyStackedAxisLayoutStrategy,
  EAutoRange,
} from "scichart";

// Nama-nama Lead standar EKG
const LEAD_NAMES = [
  "I",
  "II",
  "III",
  "aVR",
  "aVL",
  "aVF",
  "V1",
  "V2",
  "V3",
  "V4",
  "V5",
  "V6",
];

export const ECGChart = ({ apiResponse }) => {
  const sciChartDivId = "ecg-chart-root";
  const sciChartRef = useRef(null);

  useEffect(() => {
    // Pastikan API response ada dan memiliki data sinyal
    if (!apiResponse || !apiResponse.signal_data) return;

    let sciChartSurface;
    let wasmContext;

    const initSciChart = async () => {
      // 1. Inisialisasi Surface
      const res = await SciChartSurface.create(sciChartDivId, {
        theme: new SciChartJsTheme({
          sciChartBackground: "#1c1c1e", // Background Gelap ala Monitor Medis
          loadingAnimationBackground: "#1c1c1e",
        }),
      });
      sciChartSurface = res.sciChartSurface;
      wasmContext = res.wasmContext;

      // 2. Setup Layout Strategy (Agar sumbu Y menumpuk vertikal rapi)
      // Ini membuat grafik menumpuk I, II, III ... sampai V6 ke bawah
      sciChartSurface.layoutManager.rightOuterAxesLayoutStrategy =
        new RightAlignedOuterVerticallyStackedAxisLayoutStrategy();

      // 3. Buat SATU Sumbu X (Waktu) yang dipakai bersama
      // Asumsi: 10 detik @ 100Hz = 1000 titik.
      const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "Time (samples)",
        visibleRange: new NumberRange(0, 1000),
        drawMajorGridLines: true,
        gridlineStroke: "#333",
      });
      sciChartSurface.xAxes.add(xAxis);

      // 4. LOOPING: Buat 12 Sumbu Y dan 12 Garis Grafik
      const ecgData = apiResponse.signal_data; // Array [12][1000]

      LEAD_NAMES.forEach((leadName, index) => {
        const leadSignal = ecgData[index]; // Ambil array data untuk lead ini

        // A. Buat Y-Axis Unik untuk Lead ini
        const yAxis = new NumericAxis(wasmContext, {
          id: `yAxis_${leadName}`,
          axisTitle: leadName,
          axisTitleStyle: { fontSize: 14, color: "#228B22" }, // Judul Hijau
          visibleRange: new NumberRange(-1.5, 1.5), // Range Voltase mV standar
          autoRange: EAutoRange.Always, // Auto fit jika sinyal besar
          drawMajorGridLines: false, // Biar tidak terlalu ramai
          heightAuto: false,
          growBy: new NumberRange(0.1, 0.1), // Padding atas bawah
        });

        // Tambahkan Axis ke chart
        sciChartSurface.yAxes.add(yAxis);

        // B. Siapkan Data (X dan Y)
        // Buat array X [0, 1, 2, ... length]
        const xValues = Array.from({ length: leadSignal.length }, (_, i) => i);
        const yValues = leadSignal;

        // C. Masukkan ke DataSeries SciChart
        const dataSeries = new XyDataSeries(wasmContext, {
          dataSeriesName: leadName,
          xValues,
          yValues,
        });

        // D. Buat Renderable Series (Garisnya)
        const renderableSeries = new FastLineRenderableSeries(wasmContext, {
          yAxisId: `yAxis_${leadName}`,
          strokeThickness: 2,
          stroke: "#00FF00", // WARNA HIJAU NEON EKG
          dataSeries: dataSeries,
        });

        sciChartSurface.renderableSeries.add(renderableSeries);
      });
    };

    initSciChart();

    // Cleanup saat component unmount
    return () => {
      if (sciChartSurface) {
        sciChartSurface.delete();
      }
    };
  }, [apiResponse]); // Re-render jika apiResponse berubah

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Info Pasien */}
      <div
        style={{
          padding: "10px",
          background: "#333",
          color: "white",
          display: "flex",
          gap: "20px",
        }}
      >
        <h3>
          Prediction:{" "}
          <span style={{ color: "yellow" }}>{apiResponse?.prediction}</span>
        </h3>
        <h3>
          Confidence:{" "}
          <span style={{ color: "cyan" }}>{apiResponse?.confidence}</span>
        </h3>
      </div>

      {/* Container Chart SciChart */}
      <div id={sciChartDivId} style={{ flex: 1, width: "100%" }} />
    </div>
  );
};
