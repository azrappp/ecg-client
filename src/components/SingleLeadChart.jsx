import React, { useEffect, useRef } from "react";
import {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  ZoomPanModifier,
  MouseWheelZoomModifier,
  RolloverModifier,
  NumberRange,
  EAnimationType,
} from "scichart";

// Pastikan path import theme ini benar sesuai struktur folder Anda
import { customTheme } from "../styles/theme";

const SingleLeadChart = ({ data, verticalGroup, xVisibleRange, leadIndex }) => {
  // Gunakan ref unik untuk ID div
  const chartDivId = useRef(
    `chart-div-${leadIndex}-${Math.random().toString(36).substr(2, 9)}`
  );

  // Ref untuk menyimpan instance surface agar bisa diakses di cleanup tanpa state
  const surfaceRef = useRef(null);
  const dataSeriesRef = useRef(null);

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

  // =================================================================
  // EFFECT 1: Init, Sync (Group), & Cleanup (Ungroup + Delete)
  // =================================================================
  useEffect(() => {
    let isMounted = true;

    const initChart = async () => {
      try {
        // 1. Create Surface
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(
          chartDivId.current,
          { theme: customTheme }
        );

        // Jika komponen sudah di-unmount saat proses async ini selesai, langsung hapus
        if (!isMounted) {
          sciChartSurface.delete();
          return;
        }

        // Simpan ke Ref untuk akses sinkron
        surfaceRef.current = sciChartSurface;

        // 2. Setup Axes
        const xAxis = new NumericAxis(wasmContext, {
          visibleRange: xVisibleRange, // Binding ke shared range
          drawMajorGridLines: true,
          drawMinorGridLines: false,
          axisTitle: LEAD_NAMES[leadIndex] || `Lead ${leadIndex + 1}`,
        });

        const yAxis = new NumericAxis(wasmContext, {
          autoRange: "Always",
          drawMajorGridLines: true,
          growBy: new NumberRange(0.1, 0.1),
        });

        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);

        // 3. Setup Modifiers
        const modifierGroupId = "SharedEventGroup";
        sciChartSurface.chartModifiers.add(
          new ZoomPanModifier({ modifierGroup: modifierGroupId }),
          new MouseWheelZoomModifier({ modifierGroup: modifierGroupId }),
          new RolloverModifier({ modifierGroup: modifierGroupId })
        );

        // 4. Setup Data Series
        const dataSeries = new XyDataSeries(wasmContext);
        dataSeriesRef.current = dataSeries; // Simpan ref dataSeries

        sciChartSurface.renderableSeries.add(
          new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            stroke: "auto",
            strokeThickness: 2,
            animation: {
              type: EAnimationType.Sweep,
              options: { duration: 500 },
            },
          })
        );

        // 5. Initial Data Load
        if (data && data.length > 0) {
          const xValues = data.map((_, i) => i);
          dataSeries.appendRange(xValues, data);
        }

        // 6. SYNC TO VERTICAL GROUP (Penting dilakukan di sini)
        if (verticalGroup) {
          // Defensive check: pastikan fungsi ada sebelum dipanggil
          if (typeof verticalGroup.addSurfaceToGroup === "function") {
            verticalGroup.addSurfaceToGroup(sciChartSurface);
          }
        }
      } catch (err) {
        console.error("Chart Init Failed", err);
      }
    };

    initChart();

    // --- CLEANUP FUNCTION ---
    return () => {
      isMounted = false;

      // Ambil instance dari Ref
      const surface = surfaceRef.current;

      if (surface) {
        // 1. Remove from Group (Defensive Coding)
        // Kita gunakan try-catch dan pengecekan tipe fungsi untuk mencegah crash "is not a function"
        try {
          if (
            verticalGroup &&
            typeof verticalGroup.removeSurfaceFromGroup === "function"
          ) {
            verticalGroup.removeSurfaceFromGroup(surface);
          }
        } catch (error) {
          console.warn(
            "Gagal menghapus surface dari grup (aman diabaikan):",
            error
          );
        }

        // 2. Delete Surface
        try {
          surface.delete();
        } catch (error) {
          console.warn("Gagal delete surface:", error);
        }

        surfaceRef.current = null;
        dataSeriesRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run ONCE on mount

  // =================================================================
  // EFFECT 2: Update Data Only
  // =================================================================
  useEffect(() => {
    // Cek apakah dataSeries dan data valid
    if (dataSeriesRef.current && data && data.length > 0) {
      // Pastikan surface belum dihapus (native object check)
      if (!surfaceRef.current || surfaceRef.current.isDeleted) return;

      try {
        const series = dataSeriesRef.current;
        series.clear();
        const xValues = data.map((_, i) => i);
        series.appendRange(xValues, data);

        // Paksa zoom extends agar grafik pas
        if (surfaceRef.current.zoomExtents) {
          surfaceRef.current.zoomExtents();
        }
      } catch (err) {
        console.warn("Gagal update data chart:", err);
      }
    }
  }, [data]);

  return (
    <div
      id={chartDivId.current}
      className="w-full mb-1 relative"
      style={{ height: "120px", width: "100%" }}
    />
  );
};

export default SingleLeadChart;
