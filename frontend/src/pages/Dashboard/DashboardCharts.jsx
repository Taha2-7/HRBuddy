import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register chart components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

export default function DashboardCharts({ departmentData, leaveData }) {
  // BAR CHART (Departments)
  const barData = {
    labels: Object.keys(departmentData),
    datasets: [
      {
        label: "Employees",
        data: Object.values(departmentData),
        backgroundColor: "#4e73df",
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  // PIE CHART (Leave Types)
  const pieData = {
    labels: Object.keys(leaveData),
    datasets: [
      {
        data: Object.values(leaveData),
        backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e"],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div className="row mt-4 g-3">
      {/* LEFT: BAR CHART */}
      <div className="col-md-6">
        <div className="card p-3 shadow-sm">
          <h5 className="fw-bold mb-3">Employees per Department</h5>
          <Bar data={barData} options={barOptions} height={300} />
        </div>
      </div>

      {/* RIGHT: PIE CHART */}
      <div className="col-md-6">
        <div className="card p-3 shadow-sm">
          <h5 className="fw-bold mb-3">Leave Type Breakdown</h5>
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
}
