import React, { useState } from "react";
import { FaLeaf, FaBolt, FaRecycle, FaTruck, FaWarehouse, FaBoxOpen, FaBuilding, FaCogs } from "react-icons/fa";
import "./Dashboard.css"; // Import updated CSS

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const emissionsData = [50, 55, 48, 60, 58, 52, 47, 53, 50, 49];
const energyData = [100, 98, 95, 97, 92, 90, 85, 88, 83, 80];
const recyclingData = [60, 63, 67, 65, 70, 72, 75, 78, 80, 82];

const emissionSources = [
  { name: "Fleet Vehicles", percentage: 40, current: 14000, reduction: "25%", recommendation: "Adopt EVs & optimize logistics", icon: <FaTruck className="icon-red" /> },
  { name: "Warehousing Operations", percentage: 30, current: 10500, reduction: "18%", recommendation: "Improve insulation & LED lighting", icon: <FaWarehouse className="icon-blue" /> },
  { name: "Packaging Materials", percentage: 15, current: 5250, reduction: "30%", recommendation: "Use biodegradable packaging", icon: <FaBoxOpen className="icon-yellow" /> },
  { name: "Office Facilities", percentage: 10, current: 3500, reduction: "22%", recommendation: "Switch to renewable energy", icon: <FaBuilding className="icon-green" /> },
  { name: "Equipment & Machinery", percentage: 5, current: 1750, reduction: "15%", recommendation: "Encourage green supply chain", icon: <FaCogs className="icon-purple" /> }
];

const Dashboard = () => {
  const [selectedChart, setSelectedChart] = useState("carbon");

  const getChartData = () => {
    switch (selectedChart) {
      case "carbon":
        return emissionsData;
      case "energy":
        return energyData;
      case "recycling":
        return recyclingData;
      default:
        return emissionsData;
    }
  };

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="header">
        <h1>🌿 Sustainable Logistics Dashboard</h1>
      </div>

      {/* Cards Section */}
      <div className="cards">
        <div className="card card-green" onClick={() => setSelectedChart("carbon")}>
          <FaLeaf className="card-icon" />
          <h3>Carbon Footprint</h3>
          <p className="value">28.5 tonnes CO₂e</p>
          <p className="info">↘ 12% decrease from last month</p>
        </div>

        <div className="card card-blue" onClick={() => setSelectedChart("energy")}>
          <FaBolt className="card-icon" />
          <h3>Energy Consumption</h3>
          <p className="value">156.3 MWh</p>
          <p className="info">↘ 8% decrease from last month</p>
        </div>

        <div className="card card-purple" onClick={() => setSelectedChart("recycling")}>
          <FaRecycle className="card-icon" />
          <h3>Recycling Rate</h3>
          <p className="value">76.2%</p>
          <p className="info">↗ 5% increase from last month</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts">
        <div className="chart-container">
          <h3>
            {selectedChart === "carbon"
              ? "Monthly Carbon Emissions (tonnes CO₂e)"
              : selectedChart === "energy"
              ? "Energy Usage Trend"
              : "Recycling Rate Trend"}
          </h3>
          <div className="bar-chart">
            {getChartData().map((value, index) => (
              <div key={index} className="bar" style={{ height: `${value}%` }}>
                <span className="bar-label">{months[index]}</span>
                <span className="tooltip">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emissions Table */}
      <div className="emissions-table">
        <h3>Emission Reduction Analysis</h3>
        <table>
          <thead>
            <tr>
              <th>Emission Source</th>
              <th>% of Total</th>
              <th>Current (tonnes CO₂e)</th>
              <th>Potential Reduction</th>
              <th>Recommendations</th>
            </tr>
          </thead>
          <tbody>
            {emissionSources.map((source, index) => (
              <tr key={index}>
                <td>{source.icon} {source.name}</td>
                <td>{source.percentage}%</td>
                <td>{source.current}</td>
                <td>{source.reduction}</td>
                <td>{source.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
