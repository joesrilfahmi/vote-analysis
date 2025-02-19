import React, { useState, useMemo } from "react";
import { Users, Building2, Vote, User } from "lucide-react";
import Modal from "./Modal";
import Pagination from "./Pagination";
import Input from "./Input";
import CountUp from "react-countup";

const StatCard = ({ icon: Icon, title, value, onClick, animated = true }) => (
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
        <p className="text-2xl font-bold">
          {animated ? (
            <CountUp end={value} duration={2} separator="," start={0} />
          ) : (
            value.toLocaleString()
          )}
        </p>
      </div>
    </div>
  </div>
);

const Statistics = ({ stats }) => {
  const [modalType, setModalType] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalVotes = Object.values(stats.voteCount).reduce((a, b) => a + b, 0);
  const totalCandidates = Object.keys(stats.voteCount).length;

  // Data processing for the tables
  const getData = useMemo(() => {
    let data = [];
    switch (modalType) {
      case "names":
        data = stats.uniqueNames.map((name, index) => ({
          id: index + 1,
          name,
          unit:
            stats.voterDetails[Object.keys(stats.voterDetails)[0]]?.find(
              (voter) => voter.nama === name
            )?.unit || "-",
        }));
        // Always sort names in ascending order
        data.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "units":
        data = stats.uniqueUnits.map((unit, index) => ({
          id: index + 1,
          unit,
          count:
            stats.voterDetails[Object.keys(stats.voterDetails)[0]]?.filter(
              (voter) => voter.unit === unit
            ).length || 0,
        }));
        // Always sort units in ascending order
        data.sort((a, b) => a.unit.localeCompare(b.unit));
        break;
      default:
        return [];
    }

    return data;
  }, [modalType, stats]);

  // Filter data based on search
  const filteredData = useMemo(() => {
    return getData.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      if (modalType === "names") {
        return (
          item.name.toLowerCase().includes(searchLower) ||
          item.unit.toLowerCase().includes(searchLower)
        );
      }
      return (
        item.unit.toLowerCase().includes(searchLower) ||
        item.count.toString().includes(searchLower)
      );
    });
  }, [getData, searchQuery, modalType]);

  // Pagination calculations
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredData.slice(startIndex, endIndex);

  // Function to get modal title based on type
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
    <div className="">
      {/* Statistics Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-4">Distribusi Suara</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            title="Total Pemilih"
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
            icon={User}
            title="Total Kandidat"
            value={totalCandidates}
          />
          <StatCard icon={Vote} title="Total Suara" value={totalVotes} />
        </div>
      </div>

      {/* Modal - only for names and units */}
      <Modal
        isOpen={!!modalType && (modalType === "names" || modalType === "units")}
        onClose={() => {
          setModalType(null);
          setSearchQuery("");
          setCurrentPage(1);
        }}
        title={getModalTitle()}
      >
        <div className="space-y-4">
          {/* Search input */}
          <div className="mb-4">
            <Input
              type="text"
              placeholder={
                modalType === "names"
                  ? "Cari nama atau unit..."
                  : "Cari unit..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              isSearch
            />
          </div>

          {/* Table section */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-left">No</th>
                  {modalType === "names" ? (
                    <>
                      <th className="p-3 text-left">Nama</th>
                      <th className="p-3 text-left">Unit</th>
                    </>
                  ) : (
                    <>
                      <th className="p-3 text-left">Unit</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="p-3">{startIndex + index + 1}</td>
                      {modalType === "names" ? (
                        <>
                          <td className="p-3">{item.name}</td>
                          <td className="p-3">{item.unit}</td>
                        </>
                      ) : (
                        <>
                          <td className="p-3">{item.unit}</td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-3 text-center">
                      Data tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination section */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {endIndex} of {totalItems} entries
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Statistics;
