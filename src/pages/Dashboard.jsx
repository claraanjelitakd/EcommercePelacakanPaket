import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, Trash2, X, Edit3, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../api/api";
import Button from "../reusable/Button";

export default function DashboardPelacakan() {
  // --- STATE ---
  const [packages, setPackages] = useState([]);
  const [searchNo, setSearchNo] = useState("");
  const [showScanMasuk, setShowScanMasuk] = useState(false);
  const [showScanKeluar, setShowScanKeluar] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [packages, setPackages] = useState([]);

  // State Filter
  const [filterMonth, setFilterMonth] = useState("");
  const [filterEkspedisi, setFilterEkspedisi] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterByMasuk, setFilterByMasuk] = useState("All");
  const [filterByKeluar, setFilterByKeluar] = useState("All");

  // State Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPkgId, setEditingPkgId] = useState(null);
  const [editInput, setEditInput] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // --- EFFECT ---
  useEffect(() => {
    inputRef.current?.focus();
  }, [mode, packages]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get("/packages");
      setPackages(res.data);
    } catch (err) {
      console.error("❌ Error fetching packages:", err);
    }
  };

  // --- Logic ---

  // Fungsi baru untuk memformat tanggal
  const formatTanggal = (tanggalString) => {
    if (!tanggalString) {
      return "-"; // Kembalikan strip jika data kosong
    }

    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Gunakan format 24 jam
    };

    // 'id-ID' untuk format Indonesia (Contoh: 13 Nov 2025, 14:30)
    return new Date(tanggalString).toLocaleString('id-ID', options);
  };

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    const value = scanValue.trim().toUpperCase();
    if (!value) return;

    const exists = packages.find((p) => p.noResi === value);

    if (mode === "masuk" && exists) {
      alert("❌ Nomor resi sudah ada di database!");
      setScanValue("");
      return;
    }

    if (mode === "keluar" && !exists) {
      alert("❌ Nomor resi tidak ditemukan! Scan Masuk terlebih dahulu.");
      setScanValue("");
      return;
    }

    try {
      const endpoint = mode === "masuk" ? "/packages/masuk" : "/packages/keluar";
      const body =
        mode === "masuk"
          ? { noResi: value, byMasuk: "admin" }
          : { noResi: value, byKeluar: "admin" };

      const res = await api.post(endpoint, body);
      const data = res.data;

      if (mode === "masuk") {
        setPackages((prev) => [data, ...prev]);
      } else {
        setPackages((prev) =>
          prev.map((p) => (p.noResi === data.noResi ? data : p))
        );
      }
      new Audio("/success-beep.mp3").play().catch(() => { });
    } catch (err) {
      console.error("Error saat scan:", err);
      alert(`Gagal memproses resi! ${err.response?.data?.message || ""}`);
    } finally {
      setScanValue("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus paket ini?")) return;
    try {
      await api.delete(`/packages/${id}`);
      setPackages((pkgs) => pkgs.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("Gagal menghapus data dari server.");
    }
  };

  const openEditModal = (id) => {
    const pkg = packages.find((p) => p.id === id);
    if (!pkg) return;
    setEditingPkgId(id);
    setEditInput(pkg.noResi);
    setEditModalOpen(true);
  };

  const saveEdit = async () => {
    if (!editInput.trim()) return alert("Nomor resi tidak boleh kosong!");
    const newNo = editInput.trim().toUpperCase();
    try {
      const res = await api.put(`/packages/${editingPkgId}`, {
        noResi: newNo,
      });
      const updatedData = res.data;
      setPackages((prev) =>
        prev.map((p) => (p.id === editingPkgId ? { ...p, ...updatedData } : p))
      );
      setEditModalOpen(false);
      setEditingPkgId(null);
      setEditInput("");
    } catch (err) {
      console.error("Gagal update:", err);
      alert("Gagal mengupdate data resi.");
    }
  };

  // --- FILTERING ---
  const listByMasuk = useMemo(() => {
    const names = packages.map(p => p.byMasuk).filter(Boolean);
    return ['All', ...new Set(names)];
  }, [packages]);

  const listByKeluar = useMemo(() => {
    const names = packages.map(p => p.byKeluar).filter(Boolean);
    return ['All', ...new Set(names)];
  }, [packages]);

  // 'filtered' berisi SEMUA hasil yang cocok (belum dipaginasi)
  const filtered = useMemo(() => {
    return packages
      .filter((pkg) => pkg.noResi.toLowerCase().includes(searchNo.toLowerCase()))
      .filter((pkg) => filterEkspedisi === "All" ? true : pkg.ekspedisi === filterEkspedisi)
      .filter((pkg) => filterStatus === "All" ? true : pkg.status === filterStatus)
      .filter((pkg) => filterByMasuk === "All" ? true : pkg.byMasuk === filterByMasuk)
      .filter((pkg) => filterByKeluar === "All" ? true : pkg.byKeluar === filterByKeluar)
      .filter((pkg) => {
        if (!filterMonth) return true;
        if (!pkg.scanMasuk) return false;
        return pkg.scanMasuk.startsWith(filterMonth);
      });
  }, [packages, searchNo, filterEkspedisi, filterStatus, filterByMasuk, filterByKeluar, filterMonth]);

  // Reset ke halaman 1 setiap kali filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchNo, filterEkspedisi, filterStatus, filterByMasuk, filterByKeluar, filterMonth]);

  // 'currentItems' berisi item yang sudah difilter DAN dipaginasi
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filtered.slice(indexOfFirstItem, indexOfLastItem);
  }, [filtered, currentPage, itemsPerPage]);

  // Hitung total halaman
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Handler untuk ganti halaman
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "terkirim" || s === "keluar")
      return "bg-green-100 text-green-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const countMasuk = packages.filter((p) => !!p.scanMasuk).length;
  const countKeluar = packages.filter((p) => !!p.scanKeluar).length;

  // --- RENDER ---
  return (
    <div className="content--with-sidebar min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-100 text-gray-800 p-6 md:p-10">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6 text-center">
        <div className="flex justify-center gap-4 mb-4">
          <Button
            onClick={() => setMode("masuk")}
            variant={mode === "masuk" ? "primary" : "secondary"}
            className={`px-6 py-3 ${mode === "masuk"
              ? "scale-105 shadow-lg"
              : "bg-gray-100 text-gray-500"
              }`}
          >
            📦 Scan Masuk
          </Button>

          <Button
            onClick={() => setMode("keluar")}
            variant={mode === "keluar" ? "primary" : "secondary"}
            className={`px-6 py-3 ${mode === "keluar"
              ? "bg-green-600 hover:bg-green-700 scale-105 shadow-lg"
              : "bg-gray-100 text-gray-500"
              }`}
          >
            🚚 Scan Keluar
          </Button>
        </div>

        <form onSubmit={handleScanSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={scanValue}
            onChange={(e) => setScanValue(e.target.value)}
            autoFocus
            placeholder={`Scan resi untuk ${mode === "masuk" ? "MASUK (IN)" : "KELUAR (OUT)"
              }...`}
            className={`w-full px-4 py-3 border-2 rounded-lg text-lg text-center tracking-widest uppercase focus:outline-none transition-colors ${mode === "masuk"
              ? "focus:border-purple-500 focus:ring-purple-200"
              : "focus:border-green-500 focus:ring-green-200"
              }`}
          />
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white h-[120px] rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center">
          <div className="text-xl text-gray-600">Total Masuk</div>
          <div className="text-3xl font-bold text-purple-700">{countMasuk}</div>
        </div>
        <div className="bg-white h-[120px] rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center">
          <div className="text-xl text-gray-600">Total Keluar</div>
          <div className="text-3xl font-bold text-green-700">{countKeluar}</div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
          <div className="flex-1 flex items-center gap-2 w-full bg-gray-50 px-3 py-2 rounded border">
            <Search className="text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari no. resi..."
              value={searchNo}
              onChange={(e) => setSearchNo(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>
          {/* Filter Bulan */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="border px-3 py-2 rounded bg-white text-sm w-full"
            />
            <Button variant="ghost" onClick={() => setFilterMonth("")} className="px-2" title="Reset Bulan">
              <X size={18} className="text-red-500" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          <select
            value={filterEkspedisi}
            onChange={(e) => setFilterEkspedisi(e.target.value)}
            className="px-3 py-2 border rounded bg-white text-sm cursor-pointer"
          >
            <option value="All">Semua Ekspedisi</option>
            <option value="Jogja Express">Jogja Express (JSX)</option>
            <option value="Jalur Nugraha Ekakurir">JNE</option>
            <option value="Titipan Kilat">TIKI</option>
            <option value="Pos Indonesia">Pos Indonesia</option>
            <option value="SiCepat Express">SiCepat (SCP)</option>
            <option value="J&T Express">J&T Express (JNT)</option>
            <option value="Anteraja">Anteraja (ATJ)</option>
            <option value="Lion Parcel">Lion Parcel (LPC)</option>
            <option value="Ninja Xpress">Ninja Xpress (NJX)</option>
            <option value="Wahana Express">Wahana (WHN)</option>
            <option value="GoSend">GoSend (GSD)</option>
            <option value="Grab Express">Grab Express (GBE)</option>
            <option value="SAP Express">SAP Express</option>
            <option value="Tidak Dikenal">Tidak Dikenal</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded bg-white text-sm cursor-pointer"
          >
            <option value="All">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="Terkirim">Terkirim</option>
          </select>

          <select
            value={filterByMasuk}
            onChange={(e) => setFilterByMasuk(e.target.value)}
            className="px-3 py-2 border rounded bg-white text-sm cursor-pointer"
          >
            {listByMasuk.map(name => (
              <option key={name} value={name}>{name === 'All' ? 'Oleh (Masuk)' : name}</option>
            ))}
          </select>

          <select
            value={filterByKeluar}
            onChange={(e) => setFilterByKeluar(e.target.value)}
            className="px-3 py-2 border rounded bg-white text-sm cursor-pointer"
          >
            {listByKeluar.map(name => (
              <option key={name} value={name}>{name === 'All' ? 'Oleh (Keluar)' : name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead className="bg-purple-600 text-white text-sm">
              <tr>
                <th className="px-6 py-3">No</th>
                <th className="px-6 py-3">No. Resi</th>
                <th className="px-6 py-3">Ekspedisi</th>
                <th className="px-6 py-3">Waktu Masuk</th>
                <th className="px-6 py-3">Oleh (Masuk)</th>
                <th className="px-6 py-3">Waktu Keluar</th>
                <th className="px-6 py-3">Oleh (Keluar)</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentItems.length > 0 ? (
                currentItems.map((pkg, i) => (
                  <tr
                    key={pkg.id}
                    className="border-b hover:bg-purple-50 transition"
                  >
                    <td className="px-6 py-3">{i + (currentPage - 1) * itemsPerPage + 1}</td>
                    <td className="px-6 py-3 font-mono font-medium text-gray-700">
                      {pkg.noResi}
                    </td>
                    <td className="px-6 py-3">{pkg.ekspedisi}</td>

                    <td className="px-6 py-3 text-gray-500">
                      {formatTanggal(pkg.scanMasuk)}
                    </td>
                    <td className="px-6 py-3 text-gray-700 font-medium">
                      {pkg.byMasuk || "-"}
                    </td>

                    <td className="px-6 py-3 text-gray-500">
                      {formatTanggal(pkg.scanKeluar)}
                    </td>
                    <td className="px-6 py-3 text-gray-700 font-medium">
                      {pkg.byKeluar || "-"}
                    </td>

                    <td className="px-6 py-3">
                      <span
                        className={`${getStatusColor(
                          pkg.status
                        )} px-3 py-1 rounded-full text-xs font-bold`}
                      >
                        {pkg.status}
                      </span>
                    </td>

                    <td className="px-6 py-3 flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        onClick={() => openEditModal(pkg.id)}
                        className="text-blue-600 hover:text-blue-800 px-1 py-1"
                        title="Edit Resi"
                      >
                        <Edit3 size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(pkg.id)}
                        className="text-red-500 hover:text-red-700 px-1 py-1"
                        title="Hapus Paket"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Tidak ada data paket yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t bg-gray-50">
            <span className="text-sm text-gray-600">
              Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
              <span className="ml-2">| Total: <strong>{filtered.length}</strong> item</span>
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1"
              >
                <ChevronLeft size={18} />
                Sebelumnya
              </Button>
              <Button
                variant="secondary"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1"
              >
                Berikutnya
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}
      </div>


      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md relative animate-in fade-in zoom-in duration-200">
            <Button
              variant="ghost"
              onClick={() => setEditModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 px-1 py-1"
            >
              <X size={20} />
            </Button>

            <h3 className="text-lg font-bold mb-1 text-gray-800">
              Edit Nomor Resi
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Pastikan nomor resi benar sebelum menyimpan.
            </p>

            <input
              type="text"
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none uppercase font-mono"
              placeholder="Contoh: JP123456"
            />
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setEditModalOpen(false)}
                className="flex-1"
              >
                Batal
              </Button>

              <Button
                variant="primary"
                onClick={saveEdit}
                className="flex-1"
              >
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
}