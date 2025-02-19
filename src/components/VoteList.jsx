// src/components/VoteList.jsx
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Modal from "./Modal";
import Pagination from "./Pagination";

const VoteList = ({ voteCount, voterDetails }) => {
  const [expandedVote, setExpandedVote] = useState(null);
  const [selectedVote, setSelectedVote] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const toggleVote = (vote) => {
    setSelectedVote(vote);
    setCurrentPage(1);
    setSearchQuery("");
  };

  const filteredVoters = selectedVote
    ? voterDetails[selectedVote].filter(
        (voter) =>
          voter.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          voter.unit.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredVoters.length / itemsPerPage);
  const paginatedVoters = filteredVoters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Detail Suara</h2>
      <div className="space-y-4">
        {Object.entries(voteCount).map(([vote, count]) => (
          <div key={vote} className="border dark:border-gray-700 rounded-lg">
            <button
              className="w-full p-4 flex justify-between items-center text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => toggleVote(vote)}
            >
              <div>
                <span className="font-semibold">{vote}</span>
                <span className="ml-2 text-gray-500">({count} suara)</span>
              </div>
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selectedVote}
        onClose={() => setSelectedVote(null)}
        title={`Detail Suara - ${selectedVote}`}
        searchable
        onSearch={setSearchQuery}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="p-3 text-left">No</th>
                <th className="p-3 text-left">Timestamp</th>
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">Unit</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVoters.map((voter, index) => (
                <tr
                  key={index}
                  className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-3">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-3">{voter.timestamp}</td>
                  <td className="p-3">{voter.nama}</td>
                  <td className="p-3">{voter.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    </div>
  );
};

export default VoteList;
