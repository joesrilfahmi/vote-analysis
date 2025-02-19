import React, { useState, useMemo, useEffect } from "react";
import Input from "./Input";
import Dropdown from "./Dropdown";
import Pagination from "./Pagination";
import Modal from "./Modal";

const VoteList = ({ voteCount, voterDetails }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedVote, setSelectedVote] = useState(null);
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [modalSelectedUnit, setModalSelectedUnit] = useState("all");
  const [unitOptions, setUnitOptions] = useState([]);
  const MODAL_ITEMS_PER_PAGE = 10;

  // Calculate unit vote counts and create dropdown options
  useEffect(() => {
    if (selectedVote) {
      const unitCounts = {};
      const voters = voterDetails[selectedVote] || [];

      // Count votes by unit
      voters.forEach((voter) => {
        const unit = voter.unit || "Unknown";
        if (!unitCounts[unit]) {
          unitCounts[unit] = 0;
        }
        unitCounts[unit]++;
      });

      // Create options with vote counts, sorted alphabetically
      const options = [
        { value: "all", label: `Semua Unit (${voters.length})` },
      ];

      // Add unit options with vote counts, sorted alphabetically
      // Fix: Change the format to place the count at the beginning to keep it aligned left
      Object.entries(unitCounts)
        .sort(([unitA], [unitB]) => unitA.localeCompare(unitB))
        .forEach(([unit, count]) => {
          options.push({ value: unit, label: `${unit} (${count})` });
        });

      setUnitOptions(options);
    }
  }, [selectedVote, voterDetails]);

  // Convert vote count object to array for table display
  // Always sort by highest votes first (desc)
  const voteData = useMemo(() => {
    return Object.entries(voteCount)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [voteCount]);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    return voteData.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [voteData, searchQuery]);

  // Calculate pagination for main table
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredData.slice(startIndex, endIndex);

  // Filter modal data and sort by name (asc)
  const filteredVoters = useMemo(() => {
    if (!selectedVote) return [];

    let voters = voterDetails[selectedVote] || [];

    // Apply unit filter in modal if a specific unit is selected
    if (modalSelectedUnit !== "all") {
      voters = voters.filter((voter) => voter.unit === modalSelectedUnit);
    }

    // Apply search filter
    return voters
      .filter((voter) => {
        const searchLower = modalSearchQuery.toLowerCase();
        return (
          voter.nama.toLowerCase().includes(searchLower) ||
          voter.unit.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => a.nama.localeCompare(b.nama)); // Sort by name ascending
  }, [selectedVote, voterDetails, modalSearchQuery, modalSelectedUnit]);

  // Calculate pagination for modal
  const modalTotalPages = Math.ceil(
    filteredVoters.length / MODAL_ITEMS_PER_PAGE
  );
  const modalStartIndex = (modalCurrentPage - 1) * MODAL_ITEMS_PER_PAGE;
  const modalEndIndex = Math.min(
    modalStartIndex + MODAL_ITEMS_PER_PAGE,
    filteredVoters.length
  );
  const paginatedVoters = filteredVoters.slice(modalStartIndex, modalEndIndex);

  // Handle page size change
  const handlePageSizeChange = (size) => {
    setItemsPerPage(parseInt(size));
    setCurrentPage(1);
  };

  // Handle modal unit filter change
  const handleModalUnitChange = (unit) => {
    setModalSelectedUnit(unit);
    setModalCurrentPage(1);
  };

  // Handle row click
  const handleRowClick = (item) => {
    setSelectedVote(item.name);
    setModalCurrentPage(1);
    setModalSearchQuery("");
    setModalSelectedUnit("all");
  };

  // Get the total vote count based on modal filter
  const getFilteredVoteCount = () => {
    if (!selectedVote) return 0;
    if (modalSelectedUnit === "all") return voteCount[selectedVote] || 0;

    // Count votes for the selected unit
    const voters = voterDetails[selectedVote] || [];
    return voters.filter((voter) => voter.unit === modalSelectedUnit).length;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Detail Suara</h2>

      {/* Controls section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Cari nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            isSearch
          />
        </div>
        <div className="w-full sm:w-48">
          <Dropdown
            options={["5", "10", "25", "50"]}
            value={itemsPerPage.toString()}
            onChange={handlePageSizeChange}
            placeholder="Tampilkan data"
          />
        </div>
      </div>

      {/* Table section */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-left">No</th>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-center">Jumlah Suara</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr
                  key={item.name}
                  className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleRowClick(item)}
                >
                  <td className="p-3">{startIndex + index + 1}</td>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3 text-center">
                    <span className="px-3 py-1.5 rounded-full bg-blue-600 text-white text-sm font-medium">
                      {item.count}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-3 text-center">
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

      {/* Modal */}
      <Modal
        isOpen={!!selectedVote}
        onClose={() => setSelectedVote(null)}
        title={`${selectedVote} : ${getFilteredVoteCount()} Suara`}
      >
        <div className="space-y-4">
          {/* Modal Controls - Search and Unit Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Cari nama atau unit..."
                value={modalSearchQuery}
                onChange={(e) => setModalSearchQuery(e.target.value)}
                isSearch
              />
            </div>
            <div className="w-full sm:w-64">
              <Dropdown
                options={unitOptions}
                value={modalSelectedUnit}
                onChange={handleModalUnitChange}
                placeholder="Filter Unit"
              />
            </div>
          </div>

          {/* Modal Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Timestamp</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">Unit</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVoters.length > 0 ? (
                  paginatedVoters.map((voter, index) => (
                    <tr
                      key={index}
                      className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="p-3">{modalStartIndex + index + 1}</td>
                      <td className="p-3">{voter.timestamp}</td>
                      <td className="p-3">{voter.nama}</td>
                      <td className="p-3">{voter.unit}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-3 text-center">
                      Data tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal Pagination */}
          {modalTotalPages > 1 && (
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {modalStartIndex + 1} to {modalEndIndex} of{" "}
                {filteredVoters.length} entries
              </div>
              <Pagination
                currentPage={modalCurrentPage}
                totalPages={modalTotalPages}
                onPageChange={setModalCurrentPage}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default VoteList;
