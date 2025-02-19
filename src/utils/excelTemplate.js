// src/utils/excelTemplate.js
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const generateExcelTemplate = () => {
  const currentDate = format(new Date(), "dd/MM/yyyy HH:mm:ss", { locale: id });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    ["Timestamp", "Nama", "Unit", "Suara"],
    [currentDate, "John Doe", "IT", "Kandidat 1, Kandidat 2"],
    [currentDate, "Jane Smith", "HR", "Kandidat 2, Kandidat 3"],
  ]);

  // Set column widths
  ws["!cols"] = [
    { wch: 20 }, // Timestamp
    { wch: 30 }, // Nama
    { wch: 20 }, // Unit
    { wch: 40 }, // Suara
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.writeFile(wb, "template-analisis-suara.xlsx");
};
