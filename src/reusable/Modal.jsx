import React from "react";
import Button from "./Button";
import { X } from "lucide-react";

/**
 * Komponen Modal Reusable
 *
 * @param {object} props
 * @param {boolean} props.show - Tampilkan atau sembunyikan modal
 * @param {string} props.title - Judul di header modal
 * @param {React.ReactNode} props.children - Konten (isi) modal, biasanya form
 * @param {function} props.onClose - Fungsi untuk menutup modal (klik tombol X atau Batal)
 * @param {function} props.onSave - Fungsi untuk tombol "Simpan"
 * @param {string} [props.saveText="Simpan"] - Teks untuk tombol "Simpan"
 * @param {string} [props.cancelText="Batal"] - Teks untuk tombol "Batal"
 */
const Modal = ({
  show,
  title,
  children,
  onClose,
  onSave,
  saveText = "Simpan",
  cancelText = "Batal"
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      
      {/* Kontainer Modal */}
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <Button
            variant="ghost"
            isIconOnly={true}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            title="Tutup"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Modal Body (Konten Anda) */}
        <div className="py-6">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 md:flex-none"
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            onClick={onSave}
            className="flex-1 md:flex-none"
          >
            {saveText}
          </Button>
        </div>
        
      </div>
    </div>
  );
};

export default Modal;