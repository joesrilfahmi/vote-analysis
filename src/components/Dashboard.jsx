// src/components/Dashboard.jsx
import React, { useState } from "react";
import useVoteStore from "../store/useVoteStore";
import FileUpload from "./FileUpload";
import Statistics from "./Statistics";
import VoteChart from "./VoteChart";
import VoteList from "./VoteList";

const Dashboard = () => {
  const { stats, hasData } = useVoteStore();
  const [showAnimation, setShowAnimation] = useState(true);

  return (
    <div className="space-y-8 transition-all duration-300 p-4">
      {!hasData && <FileUpload />}
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
