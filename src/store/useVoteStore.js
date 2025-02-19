import { create } from "zustand";
import * as XLSX from "xlsx";
import { parse, format } from "date-fns";
import { id } from "date-fns/locale";
import toast from "react-hot-toast";

const useVoteStore = create((set, get) => ({
  data: null,
  stats: null,
  hasData: false,

  setData: (newData) => set({ data: newData }),
  setStats: (newStats) => set({ stats: newStats }),
  setHasData: (value) => set({ hasData: value }),

  resetData: () => {
    set({ data: null, stats: null, hasData: false });
    localStorage.removeItem("voteData");
  },

  calculateStats: (data) => {
    if (!data) return;

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

    const stats = {
      totalNames: uniqueNames.size,
      totalUnits: uniqueUnits.size,
      uniqueNames: Array.from(uniqueNames),
      uniqueUnits: Array.from(uniqueUnits),
      voteCount,
      votePercentages,
      voterDetails,
    };

    set({ stats });
  },

  validateData: (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }

    const requiredColumns = ["Timestamp", "Nama", "Unit", "Suara"];
    const hasRequiredColumns = requiredColumns.every((column) =>
      data[0].hasOwnProperty(column)
    );

    if (!hasRequiredColumns) {
      return false;
    }

    return true;
  },

  processExcelFile: (file) => {
    const { validateData, calculateStats } = get();

    const processData = (jsonData) => {
      if (validateData(jsonData)) {
        const processedData = jsonData
          .map((row) => {
            let timestamp;
            try {
              if (typeof row.Timestamp === "number") {
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
                timestamp = parse(
                  row.Timestamp,
                  "dd/MM/yyyy HH:mm:ss",
                  new Date()
                );

                if (isNaN(timestamp.getTime())) {
                  timestamp = new Date(row.Timestamp);
                }
              }

              if (isNaN(timestamp.getTime())) {
                throw new Error("Invalid date");
              }

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
          .filter((item) => item.nama && item.unit && item.suara.length > 0);

        if (processedData.length === 0) {
          toast.error("Tidak ada data valid yang dapat diproses");
          return false;
        }

        set({ data: processedData, hasData: true });
        localStorage.setItem("voteData", JSON.stringify(processedData));
        calculateStats(processedData);
        if (file) toast.success("File berhasil diupload");
        return true;
      }
      return false;
    };

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
  },

  initializeData: () => {
    const savedData = localStorage.getItem("voteData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        set({ data: parsedData, hasData: true });
        get().calculateStats(parsedData);
      } catch (error) {
        console.error("Error loading saved data:", error);
        localStorage.removeItem("voteData");
      }
    }
  },
}));

export default useVoteStore;
