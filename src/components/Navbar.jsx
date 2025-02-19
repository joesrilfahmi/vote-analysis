import React, { useState, useRef } from "react";
import {
  Sun,
  Moon,
  FileSpreadsheet,
  HelpCircle,
  RefreshCw,
  Plus,
  Download,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Modal from "./Modal";
import { generateExcelTemplate } from "../utils/excelTemplate";
import useVoteStore from "../store/useVoteStore";
import toast from "react-hot-toast";
import Logo from "../assets/image/logo.webp";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { hasData, resetData } = useVoteStore();
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleReset = () => {
    resetData();
    setIsResetModalOpen(false);
    toast.success("Data berhasil direset");
  };

  const handleImportExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!["xlsx", "xls"].includes(file.name.split(".").pop().toLowerCase())) {
      toast.error("File harus berformat Excel (.xlsx atau .xls)");
      event.target.value = null;
      return;
    }

    // Tambahkan logika untuk membaca file Excel di sini
    toast.success("File berhasil diimport");
    event.target.value = null;
  };

  const renderIconButton = (icon, onClick, title, disabled = false) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      title={title}
    >
      {icon}
    </button>
  );

  return (
    <>
      <nav className="fixed top-0 z-40 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Vote Analysis
            </span>
          </div>

          <div className="flex items-center gap-2">
            {renderIconButton(
              <Plus className="h-5 w-5" />,
              () => fileInputRef.current?.click(),
              "Import Excel"
            )}

            {renderIconButton(
              <Download className="h-5 w-5" size={20} />,
              generateExcelTemplate,
              "Download Template"
            )}

            {renderIconButton(
              <HelpCircle className="h-5 w-5" />,
              () => setIsTutorialOpen(true),
              "Tutorial"
            )}

            {renderIconButton(
              <RefreshCw className="h-5 w-5" />,
              () => setIsResetModalOpen(true),
              "Reset Data",
              !hasData
            )}

            {renderIconButton(
              theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              ),
              toggleTheme,
              "Toggle Theme"
            )}
          </div>
        </div>
      </nav>

      {/* Input untuk Import Excel */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".xlsx,.xls"
        onChange={handleImportExcel}
      />

      {/* Modal Konfirmasi Reset */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Konfirmasi Reset"
      >
        <div className="space-y-4">
          <p>Apakah Anda yakin ingin mereset semua data?</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Batal
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Ya, Reset Data
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Tutorial */}
      <Modal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        title="Cara Menggunakan Analisis Suara"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          <section>
            <h3 className="text-lg font-semibold mb-2">1. Memulai Analisis</h3>
            <ul className="space-y-2 list-disc pl-5">
              <li>Download template Excel dengan mengklik icon Import Excel</li>
              <li>Isi data sesuai format yang ada pada template</li>
              <li>
                Upload file dengan cara memilih file melalui tombol Import Excel
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">2. Format Data</h3>
            <ul className="space-y-2 list-disc pl-5">
              <li>Timestamp: Waktu pengisian (otomatis)</li>
              <li>Nama: Nama pemilih</li>
              <li>Unit: Unit/Departemen pemilih</li>
              <li>
                Suara: Pilihan suara (pisahkan dengan koma jika lebih dari satu)
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">3. Fitur Tersedia</h3>
            <ul className="space-y-2 list-disc pl-5">
              <li>Visualisasi distribusi suara dalam bentuk pie chart</li>
              <li>Detail statistik pemilih dan unit</li>
              <li>Daftar lengkap suara per kandidat</li>
              <li>Fitur pencarian di setiap daftar</li>
              <li>Pagination untuk navigasi data yang lebih mudah</li>
              <li>Mode gelap/terang</li>
            </ul>
          </section>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
