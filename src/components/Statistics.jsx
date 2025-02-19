// src/components/Statistics.jsx
import React, { useState } from "react";
import { Users, Building2, Vote } from "lucide-react";
import Modal from "./Modal";
import Pagination from "./Pagination";
import { format } from "date-fns";
import { id } from "date-fns/locale";

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
        return stats.uniqueNames.map((name, index) => ({
          id: index + 1,
          name,
          unit:
            stats.voterDetails[Object.keys(stats.voterDetails)[0]].find(
              (voter) => voter.nama === name
            )?.unit || "-",
        }));
      case "units":
        return stats.uniqueUnits.map((unit, index) => ({
          id: index + 1,
          unit,
        }));
      default:
        return [];
    }
  };

  const filteredData = getFilteredData().filter((item) => {
    const query = searchQuery.toLowerCase();
    switch (modalType) {
      case "names":
        return (
          item.name.toLowerCase().includes(query) ||
          item.unit.toLowerCase().includes(query)
        );
      case "units":
        return item.unit.toLowerCase().includes(query);
      default:
        return true;
    }
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderModalContent = () => {
    if (!currentData.length && searchQuery) {
      return (
        <div className="text-center py-8 text-gray-500">
          Data yang dicari tidak ditemukan
        </div>
      );
    }

    switch (modalType) {
      case "names":
        return (
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="p-3 text-left">No</th>
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">Unit</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-3">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "units":
        return (
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="p-3 text-left">No</th>
                <th className="p-3 text-left">Unit</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-3">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-3">{item.unit}</td>
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
