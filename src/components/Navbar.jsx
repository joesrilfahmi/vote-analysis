// src/components/Navbar.jsx
import React, { useState } from "react";
import { Sun, Moon, FileDown, HelpCircle, RefreshCw } from "lucide-react";
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
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Analisis Suara
          </h1>

          <div className="flex items-center space-x-6">
            {hasData && (
              <button
                onClick={() => setIsResetModalOpen(true)}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 transition-colors"
              >
                <RefreshCw size={20} />
                <span className="font-medium">Reset</span>
              </button>
            )}

            <button
              onClick={generateExcelTemplate}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <FileDown size={20} />
              <span className="font-medium">Template</span>
            </button>

            <button
              onClick={() => setIsTutorialOpen(true)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <HelpCircle size={20} />
              <span className="font-medium">Tutorial</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
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

      {/* Tutorial Modal */}
      <Modal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        title="Cara Menggunakan Analisis Suara"
      >
        {/* Tutorial content */}
      </Modal>
    </nav>
  );
};

export default Navbar;
