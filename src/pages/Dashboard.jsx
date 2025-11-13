import React, { useState, useEffect } from "react";
import { Search, Trash2, LogOut, X, Camera } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function DashboardPelacakan() {
  const [searchNo, setSearchNo] = useState("");
  const [showScanMasuk, setShowScanMasuk] = useState(false);
  const [showScanKeluar, setShowScanKeluar] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [packages, setPackages] = useState([]);

  // mapping kode ekspedisi → nama ekspedisi
  const ekspedisiMap = {
    JSX: "Jogja Express",
    JNE: "Jalur Nugraha Ekakurir",
    TIKI: "Titipan Kilat",
    POS: "Pos Indonesia",
    SCP: "SiCepat Express",
    JNT: "J&T Express",
    ATJ: "Anteraja",
    LPC: "Lion Parcel",
    NJX: "Ninja Xpress",
    WHN: "Wahana Express",
    GSD: "GoSend",
    GBE: "Grab Express",
    SAP: "SAP Express",
  };

  const getEkspedisi = (kode) => {
    const prefix = kode.slice(0, 3).toUpperCase();
    return ekspedisiMap[prefix] || "Tidak Dikenal";
  };

  const formatDateTime = (d = new Date()) => {
    const date = d.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = d.toLocaleTimeString("en-US"); // h:mm:ss AM/PM
    return `${date} ${time}`;
  };

  // 🔹 Load & save ke session
  useEffect(() => {
    const stored = sessionStorage.getItem("packages");
    if (stored) setPackages(JSON.parse(stored));
  }, []);
  useEffect(() => {
    sessionStorage.setItem("packages", JSON.stringify(packages));
  }, [packages]);

  // 🔹 Tambah masuk
  const handleAddMasuk = (noResi) => {
    if (!noResi.trim()) return alert("Nomor resi kosong!");
    const newPkg = {
      id: Date.now(),
      ekspedisi: getEkspedisi(noResi),
      noResi,
      scanMasuk: formatDateTime(),
      jamMasuk: null,
      byMasuk: "jojo",
      scanKeluar: null,
      jamKeluar: null,
      byKeluar: "-",
      status: "Pending",
    };
    setPackages([newPkg, ...packages]);
    setManualInput("");
    setShowScanMasuk(false);
  };

  // 🔹 Tambah keluar
  const handleAddKeluar = (noResi) => {
    const updated = packages.map((pkg) =>
      pkg.noResi === noResi
        ? {
            ...pkg,
            scanKeluar: formatDateTime(),
            jamKeluar: null,
            byKeluar: "jojo",
            status: "Terkirim",
          }
        : pkg
    );
    setPackages(updated);
    setManualInput("");
    setShowScanKeluar(false);
  };

  const handleDelete = (id) => setPackages(packages.filter((p) => p.id !== id));

  const filtered = packages.filter((pkg) =>
    pkg.noResi.toLowerCase().includes(searchNo.toLowerCase())
  );

  const getStatusColor = (status) =>
    status === "Terkirim"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";

  // hitung statistik In / Out
  const countMasuk = packages.filter((p) => !!p.scanMasuk).length;
  const countKeluar = packages.filter((p) => !!p.scanKeluar).length;

  // QR Scanner
  useEffect(() => {
    if (showScanMasuk || showScanKeluar) {
      const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
      scanner.render((decodedText) => {
        if (showScanMasuk) handleAddMasuk(decodedText);
        if (showScanKeluar) handleAddKeluar(decodedText);
        scanner.clear();
      });
      return () => {
        scanner.clear().catch(() => {});
      };
    }
  }, [showScanMasuk, showScanKeluar]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-100 text-gray-800 p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-purple-700">
          📦 Sistem Pelacakan Barang
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowScanMasuk(true)}
            className="bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-lg shadow-md transition max-w-[160px]"
          >
            + Scan Masuk
          </button>
          <button
            onClick={() => setShowScanKeluar(true)}
            className="bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-lg shadow-md transition max-w-[160px]"
          >
            ↗ Scan Keluar
          </button>
        </div>
      </div>

      {/* Stats In / Out */}
      <div className="grid grid-cols-2 gap-4 mb-6 max-w-xs">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500">In</div>
          <div className="text-3xl font-bold text-purple-700">{countMasuk}</div>
          <div className="text-xs text-gray-400 mt-1">{packages.length} total</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500">Out</div>
          <div className="text-3xl font-bold text-green-700">{countKeluar}</div>
          <div className="text-xs text-gray-400 mt-1">{packages.length - countKeluar} remaining</div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-full bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center gap-3 border border-gray-200">
        <Search className="text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Cari no. resi atau ekspedisi..."
          value={searchNo}
          onChange={(e) => setSearchNo(e.target.value)}
          className="w-full outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-purple-600 text-white text-sm">
            <tr>
              <th className="px-6 py-3">No</th>
              <th className="px-6 py-3">No. Resi</th>
              <th className="px-6 py-3">Ekspedisi</th>
              <th className="px-6 py-3">Masuk</th>
              <th className="px-6 py-3">Keluar</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((pkg, i) => (
                <tr key={pkg.id} className="border-b hover:bg-purple-50 transition">
                  <td className="px-6 py-3">{i + 1}</td>
                  <td className="px-6 py-3 font-mono">{pkg.noResi}</td>
                  <td className="px-6 py-3">{pkg.ekspedisi}</td>
                  <td className="px-6 py-3">
                    {pkg.scanMasuk}
                    <div className="text-xs text-gray-500">by {pkg.byMasuk}</div>
                  </td>
                  <td className="px-6 py-3">
                    {pkg.scanKeluar ? (
                      <>
                        {pkg.scanKeluar}
                        <div className="text-xs text-gray-500">by {pkg.byKeluar}</div>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`${getStatusColor(
                        pkg.status
                      )} px-3 py-1 rounded-full text-xs font-semibold`}
                    >
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 flex gap-2">
                    {!pkg.scanKeluar && (
                      <button
                        onClick={() => handleAddKeluar(pkg.noResi)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
                      >
                        <LogOut size={16} /> Keluar
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 transition"
                    >
                      <Trash2 size={16} /> Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-6 text-center text-gray-500 text-sm"
                >
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popup Scan */}
      {(showScanMasuk || showScanKeluar) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md relative">
            <button
              onClick={() => {
                setShowScanMasuk(false);
                setShowScanKeluar(false);
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
              <Camera className="text-purple-600" />
              <span className="ml-2">
                {showScanMasuk ? "Scan Masuk" : "Scan Keluar"}
              </span>
            </h2>

            <div id="qr-reader" className="border border-gray-300 rounded-lg mb-4"></div>

            <input
              type="text"
              placeholder="Atau masukkan nomor resi manual..."
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />

            <button
              onClick={() =>
                showScanMasuk
                  ? handleAddMasuk(manualInput)
                  : handleAddKeluar(manualInput)
              }
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold py-2 rounded-lg hover:from-purple-700 hover:to-purple-600 transition"
            >
              Simpan Manual
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
