// src/components/Statistics.jsx
import React, { useState } from "react";
import { Users, Building2, Vote } from "lucide-react";
import Modal from "./Modal";
import Pagination from "./Pagination";

const StatCard = ({ icon: Icon, title, value, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg ${
      onClick ? "cursor-pointer hover:shadow-xl transition-shadow" : ""
    }`}
  >
    <div className="flex items-center">
      <Icon className="w-8 h-8 text-blue-500" />
      <div className="ml-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const Statistics = ({ stats }) => {
  const [modalType, setModalType] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const getFilteredData = () => {
    let data = [];
    const query = searchQuery.toLowerCase();

    switch (modalType) {
      case "names":
        data = stats.uniqueNames;
        return data.filter((name) => name.toLowerCase().includes(query));
      case "units":
        data = stats.uniqueUnits;
        return data.filter((unit) => unit.toLowerCase().includes(query));
      case "votes":
        data = Object.entries(stats.voterDetails).flatMap(([vote, voters]) =>
          voters.map((voter) => ({ ...voter, vote }))
        );
        return data.filter(
          (item) =>
            item.nama.toLowerCase().includes(query) ||
            item.unit.toLowerCase().includes(query) ||
            item.vote.toLowerCase().includes(query)
        );
      default:
        return [];
    }
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderModalContent = () => {
    switch (modalType) {
      case "names":
        return (
          <div className="space-y-2">
            {currentData.map((name, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                {name}
              </div>
            ))}
          </div>
        );
      case "units":
        return (
          <div className="space-y-2">
            {currentData.map((unit, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                {unit}
              </div>
            ))}
          </div>
        );
      case "votes":
        return (
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="p-3 text-left">No</th>
                <th className="p-3 text-left">Timestamp</th>
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">Unit</th>
                <th className="p-3 text-left">Suara</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-3">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-3">{item.timestamp}</td>
                  <td className="p-3">{item.nama}</td>
                  <td className="p-3">{item.unit}</td>
                  <td className="p-3">{item.vote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case "names":
        return "Daftar Nama Pemilih";
      case "units":
        return "Daftar Unit";
      case "votes":
        return "Detail Suara";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          title="Total Nama"
          value={stats.totalNames}
          onClick={() => setModalType("names")}
        />
        <StatCard
          icon={Building2}
          title="Total Unit"
          value={stats.totalUnits}
          onClick={() => setModalType("units")}
        />
        <StatCard
          icon={Vote}
          title="Total Suara"
          value={Object.values(stats.voteCount).reduce((a, b) => a + b, 0)}
          onClick={() => setModalType("votes")}
        />
      </div>

      <Modal
        isOpen={!!modalType}
        onClose={() => {
          setModalType(null);
          setSearchQuery("");
          setCurrentPage(1);
        }}
        title={getModalTitle()}
        searchable
        onSearch={handleSearch}
      >
        {renderModalContent()}
        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default Statistics;
