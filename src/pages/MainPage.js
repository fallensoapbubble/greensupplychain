import React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Button, Box, Container } from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/BarChart";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import RouteIcon from "@mui/icons-material/AltRoute";
import "./MainPage.css"; // External CSS for styling

function MainPage() {
  const navigate = useNavigate();
  const navigateTo = (path) => navigate(path);

  const sections = [
    {
      title: "Analytics",
      description: "View detailed analytics and insights.",
      path: "/analytics",
      icon: <AnalyticsIcon fontSize="large" className="section-icon" />,
      color: "#6ba292"
    },
    {
      title: "Dashboard",
      description: "Access your dashboard and manage data.",
      path: "/dashboard",
      icon: <DashboardIcon fontSize="large" className="section-icon" />,
      color: "#7d9c74"
    },
    {
      title: "Inventory",
      description: "Access your Inventory.",
      path: "/inventory",
      icon: <InventoryIcon fontSize="large" className="section-icon" />,
      color: "#b18e77"
    },
    {
      title: "Optimize Routes",
      description: "Greener Routes Right now!",
      path: "/routemanager",
      icon: <RouteIcon fontSize="large" className="section-icon" />,
      color: "#94b08c"
    },
    {
      title: "Chat with me",
      description: "I will help",
      path: "/chatbotz",
      icon: <RouteIcon fontSize="large" className="section-icon" />,
      color: "#84508c"
    },
  ];

  return (
    <Box className="main-container">
      <div className="hero-section">
        <Typography variant="h3" className="welcome-title">
          Welcome to the Dashboard
        </Typography>
        <Typography variant="subtitle1" className="welcome-subtitle">
          Explore your eco-friendly business insights
        </Typography>
      </div>
      
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center" className="card-container">
          {sections.map((section, index) => (
            <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
              <div 
                className="dashboard-card" 
                style={{"--card-accent-color": section.color}}
                onClick={() => navigateTo(section.path)}
              >
                <div className="card-icon-wrapper">
                  {section.icon}
                </div>
                <Typography variant="h6" className="card-title">
                  {section.title}
                </Typography>
                <Typography variant="body2" className="card-description">
                  {section.description}
                </Typography>
                <Button 
                  variant="contained" 
                  className="card-button"
                  style={{"--button-bg-color": section.color}}
                >
                  Explore
                </Button>
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default MainPage;