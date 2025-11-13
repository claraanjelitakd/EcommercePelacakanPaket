import React, { useState, useEffect } from "react";
import { Search, Trash2, LogOut, X, Camera, Edit3 } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function DashboardPelacakan() {
  const [searchNo, setSearchNo] = useState("");
  const [showScanMasuk, setShowScanMasuk] = useState(false);
  const [showScanKeluar, setShowScanKeluar] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [packages, setPackages] = useState([]);

  // filters
  const [filterMonth, setFilterMonth] = useState(""); // "YYYY-MM"
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [filterEkspedisi, setFilterEkspedisi] = useState("All");

  // edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPkgId, setEditingPkgId] = useState(null);
  const [editInput, setEditInput] = useState("");

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

  const ekspedisiOptions = ["All", ...Object.values(ekspedisiMap)];

  const getEkspedisi = (kode) => {
    if (!kode) return "Tidak Dikenal";
    const prefix = kode.slice(0, 3).toUpperCase();
    return ekspedisiMap[prefix] || "Tidak Dikenal";
  };

  const formatDateTime = (d = new Date()) => {
    const date = d.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = d.toLocaleTimeString("en-US"); // h:mm:ss AM/PM
    return `${date} ${time}`;
  };

  // Load & save ke session
  useEffect(() => {
    const stored = sessionStorage.getItem("packages");
    if (stored) setPackages(JSON.parse(stored));
  }, []);
  useEffect(() => {
    sessionStorage.setItem("packages", JSON.stringify(packages));
  }, [packages]);

  // helper: ensure kode max 10 chars and trimmed
  const normalizeCode = (s) => {
    if (!s) return "";
    const trimmed = s.trim();
    return trimmed.length > 10 ? trimmed.slice(0, 10) : trimmed;
  };

  // Tambah masuk
  const handleAddMasuk = (noResiRaw) => {
    const noResi = normalizeCode(noResiRaw);
    if (!noResi) return alert("Nomor resi kosong!");
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
    setPackages((prev) => [newPkg, ...prev]);
    setManualInput("");
    setShowScanMasuk(false);
    setShowScanKeluar(false);
  };

  // Tambah keluar
  const handleAddKeluar = (noResiRaw) => {
    const noResi = normalizeCode(noResiRaw);
    if (!noResi) return alert("Nomor resi kosong!");
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
    // if no matching entry, optionally add as keluar entry (keputusan: update only)
    setPackages(updated);
    setManualInput("");
    setShowScanMasuk(false);
    setShowScanKeluar(false);
  };

  // Edit via modal (replace previous prompt)
  const openEditModal = (id) => {
    const pkg = packages.find((p) => p.id === id);
    if (!pkg) return;
    setEditingPkgId(id);
    setEditInput(pkg.noResi);
    setEditModalOpen(true);
  };
  const saveEdit = () => {
    if (!editInput || !editInput.trim()) return alert("Nomor resi kosong!");
    const newNo = normalizeCode(editInput);
    const updated = packages.map((p) =>
      p.id === editingPkgId
        ? {
            ...p,
            noResi: newNo,
            ekspedisi: getEkspedisi(newNo),
          }
        : p
    );
    setPackages(updated);
    setEditModalOpen(false);
    setEditingPkgId(null);
    setEditInput("");
  };

  const handleDelete = (id) => setPackages(packages.filter((p) => p.id !== id));

  // combined filters: search, month (scanMasuk), ekspedisi
  const filtered = packages
    .filter((pkg) => pkg.noResi.toLowerCase().includes(searchNo.toLowerCase()))
    .filter((pkg) =>
      filterEkspedisi === "All" ? true : pkg.ekspedisi === filterEkspedisi
    )
    .filter((pkg) => {
      if (!filterMonth) return true;
      // filter by scanMasuk month (YYYY-MM) if scanMasuk exists
      if (!pkg.scanMasuk) return false;
      return pkg.scanMasuk.startsWith(filterMonth);
    });

  const getStatusColor = (status) =>
    status === "Terkirim"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";

  // hitung statistik In / Out
  const countMasuk = packages.filter((p) => !!p.scanMasuk).length;
  const countKeluar = packages.filter((p) => !!p.scanKeluar).length;

  // QR Scanner
  useEffect(() => {
    let scanner;
    if (showScanMasuk || showScanKeluar) {
      scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
      scanner.render((decodedText) => {
        // normalize and enforce max 10 chars, then auto-submit
        const code = normalizeCode(decodedText);
        if (!code) return;
        if (showScanMasuk) handleAddMasuk(code);
        if (showScanKeluar) handleAddKeluar(code);
        // stop scanner
        scanner
          .clear()
          .catch(() => {})
          .finally(() => {});
      });
    }
    return () => {
      if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showScanMasuk, showScanKeluar]); // no packages dep to avoid re-render loops

  // auto-submit manual input when length reaches 10
  const onManualChange = (v) => {
    setManualInput(v);
    const normalized = v.trim();
    if (normalized.length >= 10) {
      const code = normalizeCode(normalized);
      if (showScanMasuk) handleAddMasuk(code);
      else if (showScanKeluar) handleAddKeluar(code);
    }
  };

  return (
    <div className="content--with-sidebar min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-100 text-gray-800 p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-purple-700">
          📦 Sistem Pelacakan Barang
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowScanMasuk(true);
              setShowScanKeluar(false);
            }}
            className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-2 rounded-lg shadow-md transition max-w-[160px]"
          >
            + Scan Masuk
          </button>
          <button
            onClick={() => {
              setShowScanKeluar(true);
              setShowScanMasuk(false);
            }}
            className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-2 rounded-lg shadow-md transition max-w-[160px]"
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

      {/* Search + Filters */}
      <div className="max-w-full bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center gap-3 border border-gray-200">
        <Search className="text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Cari no. resi atau ekspedisi..."
          value={searchNo}
          onChange={(e) => setSearchNo(e.target.value)}
          className="w-full outline-none"
        />

        {/* month picker toggle + inline month input */}
        <div className="flex items-center gap-2 ml-3">
          <button
            onClick={() => setShowMonthPicker((s) => !s)}
            className="px-3 py-1 border rounded text-sm bg-gray-50 hover:bg-gray-100"
            title="Filter per bulan"
          >
            {filterMonth ? filterMonth : "Bulan"}
          </button>
          {showMonthPicker && (
            <div className="ml-2 flex items-center gap-2">
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="border px-2 py-1 rounded bg-white"
              />
              <button
                onClick={() => {
                  setFilterMonth("");
                  setShowMonthPicker(false);
                }}
                className="px-2 py-1 text-sm border rounded bg-white"
              >
                Clear
              </button>
            </div>
          )}

          {/* ekspedisi dropdown */}
          <select
            value={filterEkspedisi}
            onChange={(e) => setFilterEkspedisi(e.target.value)}
            className="ml-2 px-2 py-1 border rounded bg-white text-sm"
            title="Filter ekspedisi"
          >
            {ekspedisiOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
        <table className="w-full table-auto text-left">
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
                  <td className="px-6 py-3 font-mono break-words max-w-[220px]">{pkg.noResi}</td>
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
                  <td className="px-6 py-3 flex gap-2 items-center">
                    <button
                      onClick={() => openEditModal(pkg.id)}
                      className="text-purple-600 hover:text-purple-800 flex items-center gap-1 transition"
                      aria-label="Edit"
                      title="Edit"
                    >
                      <Edit3 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 transition"
                      aria-label="Hapus"
                      title="Hapus"
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
              className="bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold py-2 rounded-lg hover:from-purple-700 hover:to-purple-600 transition right-3 top-3 absolute"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
              <Camera className="text-purple-600" />
              <span className="ml-2">
                {showScanMasuk ? "Scan Masuk" : "Scan Keluar"}
              </span>
            </h2>

            <div id="qr-reader" style={{ minHeight: 260 }} className="border border-gray-300 rounded-lg mb-4"></div>

            <input
              type="text"
              placeholder="Atau masukkan nomor resi manual..."
              value={manualInput}
              onChange={(e) => onManualChange(e.target.value)}
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

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md relative">
            <button
              onClick={() => {
                setEditModalOpen(false);
                setEditingPkgId(null);
                setEditInput("");
              }}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-3 text-purple-700">Edit Nomor Resi</h3>
            <input
              type="text"
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4"
              placeholder="Masukkan nomor resi (max 10 karakter)"
            />
            <div className="flex gap-2">
              <button
                onClick={saveEdit}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white py-2 rounded"
              >
                Simpan
              </button>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingPkgId(null);
                  setEditInput("");
                }}
                className="flex-1 border rounded py-2"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}