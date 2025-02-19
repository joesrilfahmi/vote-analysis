// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useExcelData } from "../hooks/useExcelData";
import FileUpload from "./FileUpload";
import Statistics from "./Statistics";
import VoteChart from "./VoteChart";
import VoteList from "./VoteList";
import { CountUp } from "react-countup";

const Dashboard = () => {
  const { stats, processExcelFile, hasData } = useExcelData();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("voteData");
    if (savedData) {
      processExcelFile(null, JSON.parse(savedData));
    }
    setShowAnimation(true);
  }, []);

  return (
    <div className="space-y-8 transition-all duration-300 p-4">
      {!hasData && <FileUpload onFileUpload={processExcelFile} />}
      {stats && (
        <div className={`space-y-8 ${showAnimation ? "animate-fadeIn" : ""}`}>
          <VoteChart data={stats.voteCount} voterDetails={stats.voterDetails} />
          {/* Distribution Statistics First */}
          <Statistics stats={stats} />
          {/* Vote Chart and List Below */}
          <VoteList
            voteCount={stats.voteCount}
            voterDetails={stats.voterDetails}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
