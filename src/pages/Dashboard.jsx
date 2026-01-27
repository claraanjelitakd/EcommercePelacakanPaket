import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  Trash2,
  X,
  Edit3,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  CalendarDays,
  ChevronDown,
  Truck,
  ListFilter,
  UserCheck,
  Camera,
  ShieldAlert,
  Building,
  Kanban,
} from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import api from "../api/api";
import Button from "../reusable/Button";

export default function Dashboard() {
  // --- 1. CEK ROLE USER ---
  const getUserData = () => {
    const savedData = localStorage.getItem("user");
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const currentUser = getUserData();
  const userRole = currentUser?.role?.name || "";

  const isSuperAdmin = userRole === "Super Admin";
  const isOwner = userRole === "Owner";

  // State Utama
  const [mode, setMode] = useState("masuk");
  const [scanValue, setScanValue] = useState("");
  const inputRef = useRef(null);

  // State Animasi
  const [animateMasuk, setAnimateMasuk] = useState(false);
  const [animateKeluar, setAnimateKeluar] = useState(false);

  const [showScanner, setShowScanner] = useState(false);
  const isProcessingRef = useRef(false);

  // State Data
  const [packages, setPackages] = useState([]);
  const [searchNo, setSearchNo] = useState("");
  const [listApplications, setListApplications] = useState([]);
  const [listBranches, setListBranches] = useState([]);

  // State Filter
  const [filterApp, setFilterApp] = useState("All");
  const [filterBranch, setFilterBranch] = useState("All");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterEkspedisi, setFilterEkspedisi] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterByMasuk, setFilterByMasuk] = useState("All");
  const [filterByKeluar, setFilterByKeluar] = useState("All");

  // State Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPkgId, setEditingPkgId] = useState(null);
  const [editInput, setEditInput] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // --- EFFECT ---
  useEffect(() => {
    if (!isSuperAdmin) {
      inputRef.current?.focus();
    }
  }, [mode, packages.length, isSuperAdmin]);

  // Fetch Packages & Filter Data
  /* KODE LAMA DIKOMEN (Hanya jalan sekali, kurang cocok untuk Multiple User)
  useEffect(() => {
    const initData = async () => {
      await fetchPackages(); 
      await fetchFilterData();
    };
    initData();
  }, [isSuperAdmin, isOwner]);
  */

  // --- PERBAIKAN MULTIPLE USER (Poin 3) ---
  // 1. Ambil list Dropdown (App & Branch)
  useEffect(() => {
    fetchFilterData();
  }, [isSuperAdmin, isOwner]);

  // 2. Narik data paket SETIAP KALI filter berubah (Sinkronisasi Server)
  useEffect(() => {
    fetchPackages();
  }, [
    searchNo,
    filterApp,
    filterBranch,
    filterMonth,
    filterEkspedisi,
    filterStatus,
  ]);

  // 3. AUTO-REFRESH: Cek data baru setiap 30 detik agar antar user sinkron otomatis
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPackages();
    }, 30000);
    return () => clearInterval(interval);
  }, [
    searchNo,
    filterApp,
    filterBranch,
    filterMonth,
    filterEkspedisi,
    filterStatus,
  ]);

  const fetchFilterData = async () => {
    try {
      if (isSuperAdmin) {
        const [appRes, branchRes] = await Promise.all([
          api.get("/applications"),
          api.get("/branches"),
        ]);
        setListApplications(appRes.data);
        setListBranches(branchRes.data);
      } else if (isOwner) {
        const branchRes = await api.get("/branches");
        setListBranches(branchRes.data);
      }
    } catch (err) {
      console.error("Gagal ambil data filter:", err);
    }
  };

  useEffect(() => {
    let scanner;
    if (showScanner && !isSuperAdmin) {
      scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 15, // Ditingkatkan dari 10 ke 15 agar lebih responsif
          qrbox: { width: 350, height: 150 },
          aspectRatio: 1.0,
          disableFlip: false,
        },
        false,
      );

      scanner.render(
        (decodedText) => {
          const cleanText = decodedText.trim().toUpperCase();
          if (cleanText.length > 3) {
            // setScanValue(cleanText); // Ini dikomen karena processSubmit sekarang menghapus value secepatnya
            processSubmit(cleanText);
          }
        },
        (errorMessage) => {},
      );
    }

    return () => {
      if (scanner) {
        try {
          scanner.clear();
        } catch (error) {}
      }
      isProcessingRef.current = false;
    };
  }, [showScanner, mode, isSuperAdmin]);

  // --- API HANDLERS ---
  const processSubmit = async (code) => {
    if (isSuperAdmin || !code || code.trim() === "" || isProcessingRef.current)
      return;

    // --- POIN NO. 2: RESET INSTAN ---
    isProcessingRef.current = true;
    const targetCode = code.trim().toUpperCase();
    setScanValue(""); // Langsung kosongkan input SEBELUM nunggu API (Anti-Delay)

    try {
      const endpoint =
        mode === "masuk" ? "/packages/masuk" : "/packages/keluar";
      const res = await api.post(endpoint, { noResi: targetCode });
      const data = res.data;

      // --- POIN NO. 3: FUNCTIONAL UPDATE ---
      setPackages((prev) => {
        if (mode === "masuk") {
          return [data, ...prev]; // Tambah ke atas
        } else {
          // Mode keluar: cari apakah resi sudah ada di list untuk diupdate statusnya
          const existsLocally = prev.find((p) => p.noResi === data.noResi);
          return existsLocally
            ? prev.map((p) => (p.noResi === data.noResi ? data : p))
            : [data, ...prev];
        }
      });

      new Audio("/success-beep.mp3").play().catch(() => {});
    } catch (err) {
      console.error("Scan Error:", err);
      alert(`Gagal: ${err.response?.data?.message || "Terjadi kesalahan"}`);
    } finally {
      // --- POIN NO. 1: REMOVE DELAY ---
      /* KODE LAMA DIKOMEN
      setTimeout(() => {
        isProcessingRef.current = false; 
      }, 1500);
      */
      isProcessingRef.current = false; // Buka kunci langsung (Anti-Delay)
      inputRef.current?.focus();
    }
  };

  /* KODE LAMA DIKOMEN (Hanya ambil data tanpa parameter)
  const fetchPackages = async () => {
    try {
      const res = await api.get("/packages");
      setPackages(res.data);
    } catch (err) {
      console.error("❌ Error fetching packages:", err);
    }
  };
  */

  // --- SESUDAH (DIPERBAIKI UNTUK MULTIPLE USER / SERVER-SIDE FILTER) ---
  const fetchPackages = async () => {
    try {
      // Kirim parameter filter ke database agar data selalu sinkron antar user
      const res = await api.get("/packages", {
        params: {
          search: searchNo || undefined,
          appId: filterApp !== "All" ? filterApp : undefined,
          branchId: filterBranch !== "All" ? filterBranch : undefined,
          month: filterMonth || undefined,
          ekspedisi: filterEkspedisi !== "All" ? filterEkspedisi : undefined,
          status: filterStatus !== "All" ? filterStatus : undefined,
        },
      });
      setPackages(res.data);
    } catch (err) {
      console.error("❌ Error fetching packages:", err);
    }
  };

  const handleDelete = async (id) => {
    if (isSuperAdmin) return;
    if (!window.confirm("Yakin ingin menghapus paket ini?")) return;
    try {
      await api.delete(`/packages/${id}`);
      setPackages((pkgs) => pkgs.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("Gagal menghapus data. Pastikan Anda memiliki akses.");
    }
  };

  const openEditModal = (id) => {
    if (isSuperAdmin) return;
    const pkg = packages.find((p) => p.id === id);
    if (!pkg) return;
    setEditingPkgId(id);
    setEditInput(pkg.noResi);
    setEditModalOpen(true);
  };

  const saveEdit = async () => {
    if (!editInput.trim()) return alert("Nomor resi tidak boleh kosong!");
    try {
      const res = await api.put(`/packages/${editingPkgId}`, {
        noResi: editInput.trim().toUpperCase(),
      });
      const updatedData = res.data;
      setPackages((prev) =>
        prev.map((p) => (p.id === editingPkgId ? { ...p, ...updatedData } : p)),
      );
      setEditModalOpen(false);
      setEditingPkgId(null);
      setEditInput("");
    } catch (err) {
      console.error("Gagal update:", err);
      alert("Gagal mengupdate data resi.");
    }
  };

  // --- Logic UI ---
  const formatTanggal = (tanggalString) => {
    if (!tanggalString) return "-";
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return new Date(tanggalString).toLocaleString("id-ID", options);
  };

  const handleScanSubmit = (e) => {
    e.preventDefault();
    const value = scanValue.trim().toUpperCase();
    processSubmit(value);
    // setScanValue(""); // Pindah ke processSubmit agar lebih instan
    inputRef.current?.focus();
  };

  const handleScanChange = (e) => {
    const rawValue = e.target.value;
    const cleanedValue = rawValue.replace(/[^a-zA-Z0-9-]/g, "");
    setScanValue(cleanedValue.toUpperCase().slice(0, 25));
  };

  // --- FILTERING (Memoized) ---
  const listByMasuk = useMemo(
    () => ["All", ...new Set(packages.map((p) => p.byMasuk).filter(Boolean))],
    [packages],
  );
  const listByKeluar = useMemo(
    () => ["All", ...new Set(packages.map((p) => p.byKeluar).filter(Boolean))],
    [packages],
  );

  /* KODE LAMA DIKOMEN (Penyaringan manual di browser yang terlalu berat & bikin tidak sinkron)
  const filtered = useMemo(() => {
    return packages
      .filter((pkg) =>
        pkg.noResi.toLowerCase().includes(searchNo.toLowerCase()),
      )
      ...
  }, [...]);
  */

  // --- SESUDAH (DIPERBAIKI) ---
  // Sekarang database sudah memfilter Resi, App, Branch, dll.
  // Frontend hanya memfilter sisanya (seperti nama penginput) agar ringan.
  const filtered = useMemo(() => {
    return packages.filter((pkg) => {
      const matchByMasuk =
        filterByMasuk === "All" ? true : pkg.byMasuk === filterByMasuk;
      const matchByKeluar =
        filterByKeluar === "All" ? true : pkg.byKeluar === filterByKeluar;
      return matchByMasuk && matchByKeluar;
    });
  }, [packages, filterByMasuk, filterByKeluar]);

  // Reset pagination saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filtered.length]);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filtered.slice(indexOfFirstItem, indexOfLastItem);
  }, [filtered, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Animasi Angka
  const countMasuk = filtered.filter((p) => !!p.scanMasuk).length;
  const countKeluar = filtered.filter((p) => !!p.scanKeluar).length;

  useEffect(() => {
    if (countMasuk > 0) {
      setAnimateMasuk(true);
      setTimeout(() => setAnimateMasuk(false), 300);
    }
  }, [countMasuk]);

  useEffect(() => {
    if (countKeluar > 0) {
      setAnimateKeluar(true);
      setTimeout(() => setAnimateKeluar(false), 300);
    }
  }, [countKeluar]);

  // --- RENDER (Tetap Sama) ---
  return (
    <>
      {/* 1. Statistics Cards */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6 text-center">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white h-[120px] rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center">
            <div className="text-xl text-gray-600">Total Masuk</div>
            <div
              className={`text-3xl font-bold text-purple-700 transition-transform duration-300 ${animateMasuk ? "scale-125" : "scale-100"}`}
            >
              {countMasuk}
            </div>
          </div>

          <div className="bg-white h-[120px] rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center">
            <div className="text-xl text-gray-600">Total Keluar</div>
            <div
              className={`text-3xl font-bold text-green-700 transition-transform duration-300 ${animateKeluar ? "scale-125" : "scale-100"}`}
            >
              {countKeluar}
            </div>
          </div>
        </div>

        <hr className="py-3" />

        {/* 2. SCANNING SECTION */}
        {!isSuperAdmin ? (
          <>
            <div className="flex justify-center gap-4 mb-4">
              <Button
                onClick={() => setMode("masuk")}
                variant={mode === "masuk" ? "primary" : "secondary"}
                className={`px-6 py-3 ${mode === "masuk" ? "scale-105 shadow-lg" : "bg-gray-100 text-gray-500"}`}
              >
                📦 Scan Masuk
              </Button>

              <Button
                onClick={() => setMode("keluar")}
                variant={mode === "keluar" ? "primary" : "secondary"}
                className={`px-6 py-3 ${mode === "keluar" ? "bg-green-600 hover:bg-green-700 scale-105 shadow-lg" : "bg-gray-100 text-gray-500"}`}
              >
                🚚 Scan Keluar
              </Button>
            </div>

            <form onSubmit={handleScanSubmit}>
              <div className="relative max-w-2xl mx-auto flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={scanValue}
                  onChange={handleScanChange}
                  maxLength={25}
                  autoFocus
                  placeholder={`Scan resi untuk ${mode === "masuk" ? "MASUK (IN)" : "KELUAR (OUT)"}...`}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-lg text-center tracking-widest uppercase focus:outline-none transition-colors ${
                    mode === "masuk"
                      ? "focus:border-purple-500 focus:ring-purple-200"
                      : "focus:border-green-500 focus:ring-green-200"
                  }`}
                />

                <div className="absolute right-4 flex items-center gap-2">
                  {scanValue && (
                    <button
                      type="button"
                      onClick={() => setScanValue("")}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X size={20} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowScanner(true)}
                    className="text-gray-500 hover:text-purple-600 transition-colors p-1"
                    title="Buka Kamera"
                  >
                    <Camera size={24} />
                  </button>
                </div>
              </div>
            </form>
          </>
        ) : (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center justify-center gap-3">
            <ShieldAlert className="text-purple-600" />
            <span className="text-purple-800 font-medium">
              Monitoring Mode: Anda login sebagai Super Admin (Read-Only).
            </span>
          </div>
        )}
      </div>

      {/* 3. Search & Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
          <div className="flex-1 flex items-center gap-3 w-full bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-purple-300">
            <Search className="text-gray-500 w-5 h-5 flex-shrink-0" />
            <input
              type="text"
              placeholder="Cari no. resi..."
              value={searchNo}
              onChange={(e) => setSearchNo(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-3 w-full bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              <CalendarDays className="text-gray-500 w-5 h-5 flex-shrink-0" />
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
            <Button
              variant="ghost"
              onClick={() => setFilterMonth("")}
              className="px-2"
              title="Reset Bulan"
            >
              <X size={18} className="text-red-500" />
            </Button>
          </div>
        </div>

        {/* Filter App & Branch */}
        {(isSuperAdmin || isOwner) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            {isSuperAdmin && (
              <div className="relative flex items-center w-full bg-white rounded-lg border border-gray-200">
                <Kanban className="text-purple-600 w-5 h-5 absolute left-3" />
                <select
                  value={filterApp}
                  onChange={(e) => {
                    setFilterApp(e.target.value);
                    setFilterBranch("All");
                  }}
                  className="w-full bg-transparent outline-none appearance-none text-sm cursor-pointer px-3 py-2 pl-10 font-medium text-gray-700"
                >
                  <option value="All">Semua Aplikasi</option>
                  {listApplications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.app_name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="text-gray-400 w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}

            <div
              className={`${isSuperAdmin ? "" : "col-span-2"} relative flex items-center w-full bg-white rounded-lg border border-gray-200`}
            >
              <Building className="text-purple-600 w-5 h-5 absolute left-3" />
              <select
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className="w-full bg-transparent outline-none appearance-none text-sm cursor-pointer px-3 py-2 pl-10 font-medium text-gray-700"
              >
                <option value="All">Semua Cabang</option>
                {listBranches
                  .filter((b) =>
                    filterApp === "All" ? true : b.applicationId == filterApp,
                  )
                  .map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
              </select>
              <ChevronDown className="text-gray-400 w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative flex items-center w-full bg-gray-50 rounded-lg border border-gray-200">
            <Truck className="text-gray-500 w-5 h-5 absolute left-3" />
            <select
              value={filterEkspedisi}
              onChange={(e) => setFilterEkspedisi(e.target.value)}
              className="w-full bg-transparent outline-none appearance-none text-sm cursor-pointer px-3 py-2 pl-10"
            >
              <option value="All">Semua Ekspedisi</option>
              <option value="J&T Express">J&T Express</option>
              <option value="SiCepat Express">SiCepat Express</option>
              <option value="Shopee Express">Shopee Express</option>
              <option value="JNE Express">JNE Express</option>
              <option value="ID Express">ID Express</option>
              <option value="Anteraja">Anteraja</option>
              <option value="Wahana Express">Wahana Express</option>
              <option value="J&T Cargo">J&T Cargo</option>
              <option value="Grab/Gojek">Grab/Gojek</option>
              <option value="Tidak Dikenal">Tidak Dikenal</option>
            </select>
            <ChevronDown className="text-gray-500 w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative flex items-center w-full bg-gray-50 rounded-lg border border-gray-200">
            <ListFilter className="text-gray-500 w-5 h-5 absolute left-3" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-transparent outline-none appearance-none text-sm cursor-pointer px-3 py-2 pl-10"
            >
              <option value="All">Semua Status</option>
              <option value="Pending">Pending</option>
              <option value="Terkirim">Terkirim</option>
            </select>
            <ChevronDown className="text-gray-500 w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative flex items-center w-full bg-gray-50 rounded-lg border border-gray-200">
            <UserCheck className="text-gray-500 w-5 h-5 absolute left-3" />
            <select
              value={filterByMasuk}
              onChange={(e) => setFilterByMasuk(e.target.value)}
              className="w-full bg-transparent outline-none appearance-none text-sm cursor-pointer px-3 py-2 pl-10"
            >
              {listByMasuk.map((name) => (
                <option key={name} value={name}>
                  {name === "All" ? "Oleh (Masuk)" : name}
                </option>
              ))}
            </select>
            <ChevronDown className="text-gray-500 w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative flex items-center w-full bg-gray-50 rounded-lg border border-gray-200">
            <UserCheck className="text-gray-500 w-5 h-5 absolute left-3" />
            <select
              value={filterByKeluar}
              onChange={(e) => setFilterByKeluar(e.target.value)}
              className="w-full bg-transparent outline-none appearance-none text-sm cursor-pointer px-3 py-2 pl-10"
            >
              {listByKeluar.map((name) => (
                <option key={name} value={name}>
                  {name === "All" ? "Oleh (Keluar)" : name}
                </option>
              ))}
            </select>
            <ChevronDown className="text-gray-500 w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 4. Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead className="bg-purple-600 text-white text-sm">
              <tr>
                <th className="px-6 py-3">No</th>
                <th className="px-6 py-3">No. Resi</th>
                <th className="px-6 py-3">Ekspedisi</th>
                <th className="px-6 py-3">Scan Masuk</th>
                <th className="px-6 py-3">Scan Keluar</th>
                <th className="px-6 py-3 text-center">Status</th>
                {!isSuperAdmin && (
                  <th className="px-6 py-3 text-center">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentItems.length > 0 ? (
                currentItems.map((pkg, i) => (
                  <tr
                    key={pkg.id}
                    className="border-b hover:bg-purple-50 transition"
                  >
                    <td className="px-6 py-3">
                      {i + (currentPage - 1) * itemsPerPage + 1}
                    </td>
                    <td className="px-6 py-3 font-mono font-medium text-gray-700">
                      {pkg.noResi}
                    </td>
                    <td className="px-6 py-3">{pkg.ekspedisi}</td>
                    <td className="px-6 py-3">
                      {pkg.scanMasuk ? (
                        <>
                          <div className="text-gray-700">
                            {formatTanggal(pkg.scanMasuk)}
                          </div>
                          <div className="text-gray-500 text-xs font-medium">
                            {pkg.byMasuk || "-"}
                          </div>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-3">
                      {pkg.scanKeluar ? (
                        <>
                          <div className="text-gray-700">
                            {formatTanggal(pkg.scanKeluar)}
                          </div>
                          <div className="text-gray-500 text-xs font-medium">
                            {pkg.byKeluar || "-"}
                          </div>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {pkg.status.toLowerCase() === "terkirim" ? (
                        <span title="Terkirim" className="text-green-600">
                          <CheckCircle size={20} />
                        </span>
                      ) : (
                        <span title="Pending" className="text-yellow-600">
                          <Clock size={20} />
                        </span>
                      )}
                    </td>
                    {!isSuperAdmin && (
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
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={!isSuperAdmin ? "7" : "6"}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Tidak ada data paket yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t bg-gray-50">
            <span className="text-sm text-gray-600">
              Halaman <strong>{currentPage}</strong> dari{" "}
              <strong>{totalPages}</strong>
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1"
              >
                <ChevronLeft size={18} /> Sebelumnya
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1"
              >
                Berikutnya <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Scanner */}
      {!isSuperAdmin && showScanner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[9999] p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Camera className="text-purple-600" /> Scan Barcode
              </h3>
              <button
                onClick={() => setShowScanner(false)}
                className="p-2 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-hidden rounded-xl border-2 border-gray-100">
              <div id="reader" className="w-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit */}
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
            <input
              type="text"
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none uppercase font-mono"
            />
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setEditModalOpen(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button variant="primary" onClick={saveEdit} className="flex-1">
                Simpan
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
