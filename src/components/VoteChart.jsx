// src/components/VoteChart.jsx
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import Modal from "./Modal";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Pagination from "./Pagination";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const VoteChart = ({ data, voterDetails }) => {
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));

  const handlePieClick = (_, index) => {
    setSelectedSegment(chartData[index].name);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const filteredVoters = selectedSegment
    ? voterDetails[selectedSegment].filter(
        (voter) =>
          voter.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          voter.unit.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredVoters.length / itemsPerPage);
  const currentVoters = filteredVoters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Distribusi Suara</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label={({ name, value, percent }) =>
                `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
              }
              onClick={handlePieClick}
              className="cursor-pointer"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${value} suara (${(
                  (value / Object.values(data).reduce((a, b) => a + b, 0)) *
                  100
                ).toFixed(1)}%)`,
                name,
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <Modal
        isOpen={!!selectedSegment}
        onClose={() => {
          setSelectedSegment(null);
          setSearchQuery("");
          setCurrentPage(1);
        }}
        title={`Detail Pemilih - ${selectedSegment}`}
        searchable
        onSearch={setSearchQuery}
      >
        {currentVoters.length === 0 && searchQuery ? (
          <div className="text-center py-8 text-gray-500">
            Data yang dicari tidak ditemukan
          </div>
        ) : (
          <>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Waktu</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">Unit</th>
                </tr>
              </thead>
              <tbody>
                {currentVoters.map((voter, index) => {
                  const timestamp = new Date(
                    voter.timestamp.replace(
                      /(\d{2})\/(\d{2})\/(\d{4})/,
                      "$3-$2-$1"
                    )
                  );
                  return (
                    <tr
                      key={index}
                      className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="p-3">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="p-3">
                        {format(timestamp, "dd MMMM yyyy HH:mm:ss", {
                          locale: id,
                        })}
                      </td>
                      <td className="p-3">{voter.nama}</td>
                      <td className="p-3">{voter.unit}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default VoteChart;
