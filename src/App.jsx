import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import ScanMasuk from "./pages/ScanMasuk";
import ScanKeluar from "./pages/ScanKeluar";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scan-masuk" element={<ScanMasuk />} />
          <Route path="/scan-keluar" element={<ScanKeluar />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
