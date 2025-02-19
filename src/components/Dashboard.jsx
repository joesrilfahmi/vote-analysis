// src/components/Dashboard.jsx
import React, { useEffect } from "react";
import { useExcelData } from "../hooks/useExcelData";
import FileUpload from "./FileUpload";
import Statistics from "./Statistics";
import VoteChart from "./VoteChart";
import VoteList from "./VoteList";

const Dashboard = () => {
  const { stats, processExcelFile, hasData } = useExcelData();

  useEffect(() => {
    const savedData = localStorage.getItem("voteData");
    if (savedData) {
      processExcelFile(null, JSON.parse(savedData));
    }
  }, []);

  return (
    <div className="space-y-8 transition-all duration-300 p-4">
      {!hasData && <FileUpload onFileUpload={processExcelFile} />}
      {stats && (
        <div className="animate-fadeIn space-y-8">
          <Statistics stats={stats} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <VoteChart
              data={stats.voteCount}
              voterDetails={stats.voterDetails}
            />
            <VoteList
              voteCount={stats.voteCount}
              voterDetails={stats.voterDetails}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
