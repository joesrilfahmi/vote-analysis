// src/components/Navbar.jsx
import React, { useState } from "react";
import {
  Sun,
  Moon,
  FileDown,
  HelpCircle,
  RefreshCw,
  Home,
  Search,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Modal from "./Modal";
import { generateExcelTemplate } from "../utils/excelTemplate";
import { useExcelData } from "../hooks/useExcelData";
import toast from "react-hot-toast";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { resetData, hasData } = useExcelData();
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleReset = () => {
    resetData();
    setIsResetModalOpen(false);
    toast.success("Data berhasil direset");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Home className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Analisis Suara
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="flex items-center px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <RefreshCw size={18} className="mr-2" />
              Reset
            </button>

            <button
              onClick={generateExcelTemplate}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Download Template"
            >
              <FileDown size={20} />
            </button>

            <button
              onClick={() => setIsTutorialOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Tutorial"
            >
              <HelpCircle size={20} />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Reset Modal */}
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
              Reset
            </button>
          </div>
        </div>
      </Modal>

      {/* Tutorial Modal with updated content */}
      <Modal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        title="Cara Menggunakan Analisis Suara"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          <section>
            <h3 className="text-lg font-semibold mb-2">1. Memulai Analisis</h3>
            <ul className="space-y-2 list-disc pl-5">
              <li>Download template Excel dengan mengklik icon Download</li>
              <li>Isi data sesuai format yang ada pada template</li>
              <li>Upload file dengan cara drag & drop atau klik area upload</li>
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
    </nav>
  );
};

export default Navbar;
