// src/hooks/useExcelData.js
import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export const useExcelData = () => {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [hasData, setHasData] = useState(false);

  const resetData = useCallback(() => {
    // Clear all data states
    setData(null);
    setStats(null);
    setHasData(false);
    // Remove data from localStorage
    localStorage.removeItem("voteData");
  }, []);

  const processExcelFile = useCallback((file, savedData = null) => {
    const processData = (jsonData) => {
      if (validateData(jsonData)) {
        const processedData = jsonData
          .map((row) => {
            let timestamp;
            try {
              // First try parsing the Excel date format
              if (typeof row.Timestamp === "number") {
                // Convert Excel serial number to JS date
                const excelDate = XLSX.SSF.parse_date_code(row.Timestamp);
                timestamp = format(
                  new Date(
                    excelDate.y,
                    excelDate.m - 1,
                    excelDate.d,
                    excelDate.H,
                    excelDate.M,
                    excelDate.S
                  ),
                  "dd/MM/yyyy HH:mm:ss",
                  { locale: id }
                );
              } else {
                // Try parsing as regular date string
                timestamp = format(
                  new Date(row.Timestamp),
                  "dd/MM/yyyy HH:mm:ss",
                  {
                    locale: id,
                  }
                );
              }
            } catch (error) {
              try {
                // Try parsing as ISO string
                timestamp = format(
                  parseISO(row.Timestamp),
                  "dd/MM/yyyy HH:mm:ss",
                  {
                    locale: id,
                  }
                );
              } catch (error) {
                console.error(`Error parsing timestamp for row:`, row);
                toast.error(`Format timestamp tidak valid untuk: ${row.Nama}`);
                return null;
              }
            }

            return {
              timestamp,
              nama: row.Nama?.trim() || "",
              unit: row.Unit?.trim() || "",
              suara: row.Suara?.split(",").map((s) => s.trim()) || [],
            };
          })
          .filter(Boolean); // Remove any null entries

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
      processData(savedData);
      return;
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
        toast.error("Error memproses file");
        console.error(error);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const validateData = (data) => {
    return data.every(
      (row) =>
        row.hasOwnProperty("Timestamp") &&
        row.hasOwnProperty("Nama") &&
        row.hasOwnProperty("Unit") &&
        row.hasOwnProperty("Suara")
    );
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
