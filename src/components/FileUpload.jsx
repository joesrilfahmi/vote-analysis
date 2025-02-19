import React, { useCallback, useState } from "react";
import { Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

const FileUpload = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback(
    (acceptedFiles) => {
      setError("");
      const file = acceptedFiles[0];

      if (file) {
        // Validate file type
        const validTypes = [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ];

        if (!validTypes.includes(file.type)) {
          setError("Hanya file Excel yang diperbolehkan (.xlsx, .xls)");
          return;
        }

        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  return (
    <div className="flex justify-center items-center min-h-[300px] p-4">
      <div
        {...getRootProps()}
        className={`w-full max-w-2xl p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-300
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
          }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto text-blue-500" />
        <div className="mt-4 space-y-2">
          <p className="text-lg font-medium">
            {isDragActive
              ? "Lepaskan file di sini..."
              : "Drag & drop file Excel di sini"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            atau klik untuk memilih file
          </p>
          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
