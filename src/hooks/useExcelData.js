import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { parse, format } from "date-fns";
import { id } from "date-fns/locale";

export const useExcelData = () => {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [hasData, setHasData] = useState(false);

  const resetData = useCallback(() => {
    setData(null);
    setStats(null);
    setHasData(false);
    localStorage.removeItem("voteData");
  }, []);

  const processExcelFile = useCallback((file, savedData = null) => {
    const processData = (jsonData) => {
      if (validateData(jsonData)) {
        const processedData = jsonData
          .map((row) => {
            let timestamp;
            try {
              // Handle different timestamp formats
              if (typeof row.Timestamp === "number") {
                // Handle Excel serial number date
                const excelDate = XLSX.SSF.parse_date_code(row.Timestamp);
                timestamp = new Date(
                  excelDate.y,
                  excelDate.m - 1,
                  excelDate.d,
                  excelDate.H || 0,
                  excelDate.M || 0,
                  excelDate.S || 0
                );
              } else if (typeof row.Timestamp === "string") {
                // Try parsing DD/MM/YYYY HH:mm:ss format
                timestamp = parse(
                  row.Timestamp,
                  "dd/MM/yyyy HH:mm:ss",
                  new Date()
                );

                // If parsing failed, try other common formats
                if (isNaN(timestamp.getTime())) {
                  // Try ISO format
                  timestamp = new Date(row.Timestamp);
                }
              }

              // Validate if timestamp is valid
              if (isNaN(timestamp.getTime())) {
                throw new Error("Invalid date");
              }

              // Format the timestamp consistently
              const formattedTimestamp = format(
                timestamp,
                "dd/MM/yyyy HH:mm:ss",
                { locale: id }
              );

              return {
                timestamp: formattedTimestamp,
                nama: row.Nama?.trim() || "",
                unit: row.Unit?.trim() || "",
                suara: row.Suara
                  ? row.Suara.split(",").map((s) => s.trim())
                  : [],
              };
            } catch (error) {
              console.warn(
                `Warning: Format timestamp tidak valid untuk baris:`,
                row
              );
              // Instead of returning null, try to use the original timestamp string
              return {
                timestamp: row.Timestamp || "-",
                nama: row.Nama?.trim() || "",
                unit: row.Unit?.trim() || "",
                suara: row.Suara
                  ? row.Suara.split(",").map((s) => s.trim())
                  : [],
              };
            }
          })
          .filter((item) => item.nama && item.unit && item.suara.length > 0); // Filter valid entries

        if (processedData.length === 0) {
          toast.error("Tidak ada data valid yang dapat diproses");
          return false;
        }

        setData(processedData);
        setHasData(true);
        localStorage.setItem("voteData", JSON.stringify(processedData));
        calculateStats(processedData);
        if (file) toast.success("File berhasil diupload");
        return true;
      }
      return false;
    };

    if (savedData) {
      return processData(savedData);
    }

    if (!file) return;

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Mohon upload file Excel saja");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        if (!processData(jsonData)) {
          toast.error("Format file tidak valid. Mohon periksa struktur kolom");
        }
      } catch (error) {
        console.error("Error processing file:", error);
        toast.error("Error memproses file");
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const validateData = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      toast.error("File tidak memiliki data");
      return false;
    }

    const requiredColumns = ["Timestamp", "Nama", "Unit", "Suara"];
    const hasRequiredColumns = requiredColumns.every((column) =>
      data[0].hasOwnProperty(column)
    );

    if (!hasRequiredColumns) {
      toast.error(
        "Format kolom tidak sesuai. Pastikan terdapat kolom: Timestamp, Nama, Unit, dan Suara"
      );
      return false;
    }

    return true;
  };

  const calculateStats = (data) => {
    const uniqueNames = new Set(data.map((row) => row.nama));
    const uniqueUnits = new Set(data.map((row) => row.unit));
    const voteCount = {};
    const voterDetails = {};

    data.forEach((row) => {
      row.suara.forEach((vote) => {
        voteCount[vote] = (voteCount[vote] || 0) + 1;
        if (!voterDetails[vote]) voterDetails[vote] = [];
        voterDetails[vote].push({
          timestamp: row.timestamp,
          nama: row.nama,
          unit: row.unit,
        });
      });
    });

    const totalVotes = Object.values(voteCount).reduce((a, b) => a + b, 0);
    const votePercentages = {};
    Object.entries(voteCount).forEach(([name, count]) => {
      votePercentages[name] = (count / totalVotes) * 100;
    });

    setStats({
      totalNames: uniqueNames.size,
      totalUnits: uniqueUnits.size,
      uniqueNames: Array.from(uniqueNames),
      uniqueUnits: Array.from(uniqueUnits),
      voteCount,
      votePercentages,
      voterDetails,
    });
  };

  return { data, stats, processExcelFile, resetData, hasData };
};
