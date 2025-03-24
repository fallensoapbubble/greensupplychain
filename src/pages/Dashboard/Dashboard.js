import React, { useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import {  Bolt, Recycling, LocalShipping, Warehouse, Inventory, Business, Build } from "@mui/icons-material";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const emissionsData = [50, 55, 48, 60, 58, 52, 47, 53, 50, 49];
const energyData = [100, 98, 95, 97, 92, 90, 85, 88, 83, 80];
const recyclingData = [60, 63, 67, 65, 70, 72, 75, 78, 80, 82];

const emissionSources = [
  { name: "Fleet Vehicles", percentage: 40, current: 14000, reduction: "25%", recommendation: "Adopt EVs & optimize logistics", icon: <LocalShipping color="error" /> },
  { name: "Warehousing Operations", percentage: 30, current: 10500, reduction: "18%", recommendation: "Improve insulation & LED lighting", icon: <Warehouse color="primary" /> },
  { name: "Packaging Materials", percentage: 15, current: 5250, reduction: "30%", recommendation: "Use biodegradable packaging", icon: <Inventory color="warning" /> },
  { name: "Office Facilities", percentage: 10, current: 3500, reduction: "22%", recommendation: "Switch to renewable energy", icon: <Business color="success" /> },
  { name: "Equipment & Machinery", percentage: 5, current: 1750, reduction: "15%", recommendation: "Encourage green supply chain", icon: <Build color="secondary" /> }
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
    <Box sx={{ p: 3, minHeight: "100vh", background: "#eef2f7", textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" color="#2c3e50" mb={3}>
        🌿 Sustainable Logistics Dashboard
      </Typography>

      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", mb: 4 }}>
        {[{ type: "carbon", icon: <Recycling color="secondary" />, title: "Carbon Footprint", value: "28.5 tonnes CO₂e", info: "↘ 12% decrease from last month" },
          { type: "energy", icon: <Bolt color="primary" />, title: "Energy Consumption", value: "156.3 MWh", info: "↘ 8% decrease from last month" },
          { type: "recycling", icon: <Recycling color="secondary" />, title: "Recycling Rate", value: "76.2%", info: "↗ 5% increase from last month" }].map((card, index) => (
          <Box key={index} onClick={() => setSelectedChart(card.type)} sx={{
            background: "white", p: 3, borderRadius: 2, boxShadow: 2, textAlign: "center", cursor: "pointer", transition: "0.3s", maxWidth: 280,
            '&:hover': { transform: "translateY(-5px)", boxShadow: 4 }
          }}>
            {card.icon}
            <Typography variant="h6" mt={1}>{card.title}</Typography>
            <Typography variant="h5" fontWeight="bold" color="#2c3e50" mt={1}>{card.value}</Typography>
            <Typography variant="body2" color="#7f8c8d">{card.info}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ background: "white", p: 3, borderRadius: 2, boxShadow: 2, maxWidth: "90%", mx: "auto" }}>
        <Typography variant="h6" mb={2}>
          {selectedChart === "carbon" ? "Monthly Carbon Emissions (tonnes CO₂e)" :
            selectedChart === "energy" ? "Energy Usage Trend" : "Recycling Rate Trend"}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center", alignItems: "flex-end", height: 200 }}>
          {getChartData().map((value, index) => (
            <Box key={index} sx={{ width: 30, background: "#2980b9", borderRadius: 1, position: "relative", height: `${value}%`, transition: "0.3s",
              '&:hover': { opacity: 0.85, transform: "scaleY(1.1)" } }}>
              <Typography sx={{ position: "absolute", bottom: -22, fontSize: 12, width: "100%", textAlign: "center", color: "#2c3e50" }}>{months[index]}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 4, p: 2, borderRadius: 2, boxShadow: 2, overflowX: "auto" }}>
        <Typography variant="h6" mb={2}>♻️ Emission Reduction Analysis</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Emission Source</TableCell>
              <TableCell>% of Total</TableCell>
              <TableCell>Current (tonnes CO₂e)</TableCell>
              <TableCell>Potential Reduction</TableCell>
              <TableCell>Recommendations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emissionSources.map((source, index) => (
              <TableRow key={index}>
                <TableCell>{source.icon} {source.name}</TableCell>
                <TableCell>{source.percentage}%</TableCell>
                <TableCell>{source.current}</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#27ae60" }}>{source.reduction}</TableCell>
                <TableCell sx={{ color: "#555", fontStyle: "italic" }}>{source.recommendation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Dashboard;
