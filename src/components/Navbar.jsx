// src/components/Navbar.jsx
import React, { useState } from "react";
import { Sun, Moon, FileDown, HelpCircle, RefreshCw, Home } from "lucide-react";
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

  const handleReset = () => {
    resetData();
    setIsResetModalOpen(false);
    toast.success("Data berhasil direset");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Analisis
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {hasData && (
              <button
                onClick={() => setIsResetModalOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Reset Data"
              >
                <RefreshCw size={20} className="text-red-500" />
              </button>
            )}

            <button
              onClick={generateExcelTemplate}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Download Template"
            >
              <FileDown size={20} />
            </button>

            <button
              onClick={() => setIsTutorialOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Tutorial"
            >
              <HelpCircle size={20} />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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

      <Modal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        title="Cara Menggunakan Analisis Suara"
      >
        <div className="space-y-4">
          <section className="space-y-2">
            <h3 className="text-lg font-semibold">1. Memulai Analisis</h3>
            <p>• Download template Excel dengan mengklik icon Download</p>
            <p>• Isi data sesuai format yang ada pada template</p>
            <p>• Upload file dengan cara drag & drop atau klik area upload</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold">2. Format Data</h3>
            <p>• Timestamp: Waktu pengisian (otomatis)</p>
            <p>• Nama: Nama pemilih</p>
            <p>• Unit: Unit/Departemen pemilih</p>
            <p>
              • Suara: Pilihan suara (pisahkan dengan koma jika lebih dari satu)
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold">3. Fitur Tersedia</h3>
            <p>• Visualisasi distribusi suara dalam bentuk pie chart</p>
            <p>• Detail statistik pemilih dan unit</p>
            <p>• Daftar lengkap suara per kandidat</p>
            <p>• Fitur pencarian di setiap daftar</p>
          </section>
        </div>
      </Modal>
    </nav>
  );
};

export default Navbar;
