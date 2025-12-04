import React, { useState } from "react";
import { ECGChart } from "./assets/ECGChart"; // Import komponen tadi
import EcgDashboard from "./assets/EcgDashboard";
function App() {
  const [ecgResult, setEcgResult] = useState(null);

  // Fungsi pura-pura upload (Ganti dengan fetch API asli Anda)
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      // Simpan hasil JSON ke state
      setEcgResult(result);
    } catch (error) {
      console.error("Error upload:", error);
    }
  };

  return (
    <div className="App">
      <>
        <EcgDashboard />
      </>
    </div>
  );
}

export default App;
