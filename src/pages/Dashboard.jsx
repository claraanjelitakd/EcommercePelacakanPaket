import React, { useState } from 'react';
import { Search, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';

export default function DashboardPelacakan() {
    const [searchNo, setSearchNo] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [packages, setPackages] = useState([
        {
            id: 1,
            ekspedisi: 'JogjaShopeeExpress',
            noResi: 'JSX5556161',
            scanMasuk: '2025-11-12 12:03:42',
            byMasuk: 'Admin',
            scanKeluar: '2025-11-12 12:04:08',
            byKeluar: 'Admin',
            status: 'Terkirim',
        },
        {
            id: 2,
            ekspedisi: 'JogjaShopeeExpress',
            noResi: 'JSX55556666',
            scanMasuk: '2025-10-19 08:30',
            byMasuk: 'Gita',
            scanKeluar: 'Belum Diproses',
            byKeluar: '-',
            status: 'Pending',
        },
        {
            id: 3,
            ekspedisi: 'JNE',
            noResi: 'JNE5544332211',
            scanMasuk: '2025-10-18 11:20',
            byMasuk: 'Eka',
            scanKeluar: '2025-10-18 15:45',
            byKeluar: 'Fani',
            status: 'Terkirim',
        },
    ]);

    const handleDelete = (id) => {
        setPackages(packages.filter(pkg => pkg.id !== id));
    };

    const filteredPackages = packages.filter(pkg => {
        const matchSearch = pkg.noResi.toLowerCase().includes(searchNo.toLowerCase());
        const matchDate = !filterDate || pkg.scanMasuk.includes(filterDate);
        return matchSearch && matchDate;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dasbor Pelacakan Paket</h1>
                <p className="text-gray-600">Manajemen paket masuk dan keluar untuk bisnis reseller Anda.</p>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cari No. Resi</label>
                        <input
                            type="text"
                            placeholder="Ketik untuk mencari..."
                            value={searchNo}
                            onChange={(e) => setSearchNo(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filter Tanggal</label>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-end gap-3">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition">
                            <Eye size={18} /> Scan Masuk
                        </button>
                        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition">
                            <Eye size={18} /> Scan Keluar
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">NO</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">EKSPEDISI</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">NO. RESI</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">SCAN MASUK</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">BY</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">SCAN KELUAR</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">BY</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPackages.map((pkg, index) => (
                                <tr key={pkg.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{pkg.ekspedisi}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{pkg.noResi}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{pkg.scanMasuk}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{pkg.byMasuk}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {pkg.scanKeluar === 'Belum Diproses' ? (
                                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                Belum Diproses
                                            </span>
                                        ) : (
                                            pkg.scanKeluar
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{pkg.byKeluar}</td>
                                    <td className="px-6 py-4 text-sm flex gap-2">
                                        <button className="text-blue-600 hover:text-blue-800 font-semibold transition">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pkg.id)}
                                            className="text-red-600 hover:text-red-800 font-semibold transition"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Menampilkan 1 sampai {filteredPackages.length} dari 8 hasil</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                            Sebelumnya
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                            Selanjutnya
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
