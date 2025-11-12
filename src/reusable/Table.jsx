import React from "react";

const Table = ({ data }) => {
  return (
    <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left">No</th>
          <th className="px-4 py-2 text-left">ID Paket</th>
          <th className="px-4 py-2 text-left">Nama Penerima</th>
          <th className="px-4 py-2 text-left">Status</th>
          <th className="px-4 py-2 text-left">Waktu</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, index) => (
            <tr key={index} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{row.id}</td>
              <td className="px-4 py-2">{row.nama}</td>
              <td className="px-4 py-2">{row.status}</td>
              <td className="px-4 py-2">{row.waktu}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center py-4 text-gray-400">
              Tidak ada data paket.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
