// src/components/FileUpload.jsx
import React from "react";
import { Upload } from "lucide-react";

const FileUpload = ({ onFileUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <label className="flex flex-col items-center px-6 py-8 bg-white dark:bg-gray-800 text-blue-500 rounded-lg shadow-lg tracking-wide border-2 border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-300">
        <Upload className="w-12 h-12" />
        <span className="mt-4 text-lg font-medium">Pilih File Excel</span>
        <input
          type="file"
          className="hidden"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default FileUpload;
