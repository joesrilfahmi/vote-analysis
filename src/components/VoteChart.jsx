import React, { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import Input from "./Input";
import Modal from "./Modal";
import Dropdown from "./Dropdown";
import Pagination from "./Pagination";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#8B5CF6", // Purple
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#6366F1", // Indigo
  "#84CC16", // Lime
  "#06B6D4", // Cyan
];

const VoteChart = ({ data, voterDetails }) => {
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [modalSelectedUnit, setModalSelectedUnit] = useState("all");
  const [chartType, setChartType] = useState("pie");
  const MODAL_ITEMS_PER_PAGE = 10;

  // Convert data to chart format and sort by votes
  const chartData = useMemo(() => {
    const totalVotes = Object.values(data).reduce((a, b) => a + b, 0);
    return Object.entries(data)
      .map(([name, value]) => ({
        name,
        value,
        percentage: ((value / totalVotes) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  // Chart type options
  const chartOptions = [
    { value: "pie", label: "Pie Chart" },
    { value: "donut", label: "Donut Chart" },
    { value: "bar", label: "Bar Chart" },
    { value: "horizontalBar", label: "Horizontal Bar" },
  ];

  // Custom label for pie/donut chart
  const renderCustomizedPieLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
    percentage,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={12}
      >
        {`${value} (${percentage}%)`}
      </text>
    );
  };

  // Custom label for bar chart
  const renderCustomizedBarLabel = (props) => {
    const { x, y, width, height, value } = props;
    const totalVotes = Object.values(data).reduce((a, b) => a + b, 0);
    const percentage = ((value / totalVotes) * 100).toFixed(1);

    if (chartType === "bar") {
      return (
        <text
          x={x + width / 2}
          y={y - 6}
          fill="currentColor"
          className="text-gray-600 dark:text-gray-300"
          textAnchor="middle"
          fontSize={12}
        >
          {`${value} (${percentage}%)`}
        </text>
      );
    } else {
      // Horizontal bar label
      return (
        <text
          x={x + width + 10}
          y={y + height / 2}
          fill="currentColor"
          className="text-gray-600 dark:text-gray-300"
          textAnchor="start"
          dominantBaseline="middle"
          fontSize={12}
        >
          {`${value} (${percentage}%)`}
        </text>
      );
    }
  };

  // Calculate unit options for dropdown
  const unitOptions = useMemo(() => {
    if (!selectedSegment) return [];

    const voters = voterDetails[selectedSegment] || [];
    const unitCounts = {};

    voters.forEach((voter) => {
      const unit = voter.unit || "Unknown";
      unitCounts[unit] = (unitCounts[unit] || 0) + 1;
    });

    const options = [
      { value: "all", label: `Semua Unit (${voters.length})` },
      ...Object.entries(unitCounts)
        .sort(([unitA], [unitB]) => unitA.localeCompare(unitB))
        .map(([unit, count]) => ({
          value: unit,
          label: `${unit} (${count})`,
        })),
    ];

    return options;
  }, [selectedSegment, voterDetails]);

  // Filter voters based on search and unit selection
  const filteredVoters = useMemo(() => {
    if (!selectedSegment) return [];

    let voters = voterDetails[selectedSegment] || [];

    if (modalSelectedUnit !== "all") {
      voters = voters.filter((voter) => voter.unit === modalSelectedUnit);
    }

    return voters
      .filter((voter) => {
        const searchLower = modalSearchQuery.toLowerCase();
        return (
          voter.nama.toLowerCase().includes(searchLower) ||
          voter.unit.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [selectedSegment, voterDetails, modalSearchQuery, modalSelectedUnit]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredVoters.length / MODAL_ITEMS_PER_PAGE);
  const startIndex = (modalCurrentPage - 1) * MODAL_ITEMS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + MODAL_ITEMS_PER_PAGE,
    filteredVoters.length
  );
  const currentVoters = filteredVoters.slice(startIndex, endIndex);

  const handleChartClick = (entry) => {
    setSelectedSegment(entry.name);
    setModalSearchQuery("");
    setModalCurrentPage(1);
    setModalSelectedUnit("all");
  };

  const handleModalUnitChange = (unit) => {
    setModalSelectedUnit(unit);
    setModalCurrentPage(1);
  };

  const getFilteredVoteCount = () => {
    if (!selectedSegment) return 0;
    if (modalSelectedUnit === "all") return data[selectedSegment] || 0;
    return filteredVoters.length;
  };

  const renderChart = () => {
    const totalVotes = Object.values(data).reduce((a, b) => a + b, 0);

    switch (chartType) {
      case "pie":
      case "donut":
        return (
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={chartType === "donut" ? 60 : 0}
              fill="#8884d8"
              onClick={(_, index) => handleChartClick(chartData[index])}
              className="cursor-pointer"
              label={renderCustomizedPieLabel}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${value} suara (${((value / totalVotes) * 100).toFixed(1)}%)`,
                name,
              ]}
            />
            <Legend className="text-gray-700 dark:text-gray-200" />
          </PieChart>
        );

      case "bar":
        return (
          <BarChart
            data={chartData}
            margin={{ top: 40, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              className="text-gray-600 dark:text-gray-300"
            />
            <YAxis className="text-gray-600 dark:text-gray-300" />
            <Tooltip
              formatter={(value) => [
                `${value} suara (${((value / totalVotes) * 100).toFixed(1)}%)`,
                "Jumlah Suara",
              ]}
              contentStyle={{
                backgroundColor: "rgb(255 255 255 / 0.9)",
                color: "#374151",
              }}
            />
            <Legend className="text-gray-700 dark:text-gray-200" />
            <Bar
              dataKey="value"
              name="Jumlah Suara"
              onClick={(entry) => handleChartClick(entry)}
              className="cursor-pointer"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                content={renderCustomizedBarLabel}
              />
            </Bar>
          </BarChart>
        );

      case "horizontalBar":
        return (
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" className="text-gray-600 dark:text-gray-300" />
            <YAxis
              dataKey="name"
              type="category"
              className="text-gray-600 dark:text-gray-300"
            />
            <Tooltip
              formatter={(value) => [
                `${value} suara (${((value / totalVotes) * 100).toFixed(1)}%)`,
                "Jumlah Suara",
              ]}
              contentStyle={{
                backgroundColor: "rgb(255 255 255 / 0.9)",
                color: "#374151",
              }}
            />
            <Legend className="text-gray-700 dark:text-gray-200" />
            <Bar
              dataKey="value"
              name="Jumlah Suara"
              onClick={(entry) => handleChartClick(entry)}
              className="cursor-pointer"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              <LabelList dataKey="value" content={renderCustomizedBarLabel} />
            </Bar>
          </BarChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Distribusi Suara
        </h2>
        <div className="w-48">
          <Dropdown
            options={chartOptions}
            value={chartType}
            onChange={setChartType}
            placeholder="Pilih Jenis Chart"
          />
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      <Modal
        isOpen={!!selectedSegment}
        onClose={() => {
          setSelectedSegment(null);
          setModalSearchQuery("");
          setModalCurrentPage(1);
          setModalSelectedUnit("all");
        }}
        title={`${selectedSegment} : ${getFilteredVoteCount()} Suara`}
      >
        <div className="space-y-4">
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

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-200">
                    No
                  </th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-200">
                    Timestamp
                  </th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-200">
                    Nama
                  </th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-200">
                    Unit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentVoters.length > 0 ? (
                  currentVoters.map((voter, index) => {
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
                        <td className="p-3 text-gray-700 dark:text-gray-200">
                          {startIndex + index + 1}
                        </td>
                        <td className="p-3 text-gray-700 dark:text-gray-200">
                          {format(timestamp, "dd MMMM yyyy HH:mm:ss", {
                            locale: id,
                          })}
                        </td>
                        <td className="p-3 text-gray-700 dark:text-gray-200">
                          {voter.nama}
                        </td>
                        <td className="p-3 text-gray-700 dark:text-gray-200">
                          {voter.unit}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-3 text-center text-gray-700 dark:text-gray-200"
                    >
                      Data tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {startIndex + 1} to {endIndex} of{" "}
                {filteredVoters.length} entries
              </div>
              <Pagination
                currentPage={modalCurrentPage}
                totalPages={totalPages}
                onPageChange={setModalCurrentPage}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default VoteChart;
