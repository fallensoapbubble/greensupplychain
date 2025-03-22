





import React, { useState } from 'react';
import EmissionsTracker from '../EmissionsTracker/EmissionsTracker';
import './analytics.css';

// SVG icons components
const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 4 13C4 5 12 2 12 2s8 3 8 11a7 7 0 0 1-7 7h-2z"/>
    <path d="M12 2v8.5a4.5 4.5 0 1 0 4.5-4.5H12"/>
  </svg>
);

const BarChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20V10"/>
    <path d="M18 20V4"/>
    <path d="M6 20v-4"/>
  </svg>
);

const DropletsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/>
    <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2"/>
    <path d="M12 20v2"/>
    <path d="m4.93 4.93 1.41 1.41"/>
    <path d="m17.66 17.66 1.41 1.41"/>
    <path d="M2 12h2"/>
    <path d="M20 12h2"/>
    <path d="m6.34 17.66-1.41 1.41"/>
    <path d="m19.07 4.93-1.41 1.41"/>
  </svg>
);

const WindIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
    <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
    <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
  </svg>
);

// New components for the tabbed interface
const WaterUsageTracker = () => (
  <div className="tab-panel water-panel">
    <h2 className="panel-header">Water Usage Analytics</h2>
    <div className="panel-content">
      <p className="panel-description">Track your organization's water consumption patterns and identify conservation opportunities.</p>
      <div className="visualization-placeholder">
        Water usage visualization would appear here
      </div>
    </div>
  </div>
);

const RenewableEnergyTracker = () => (
  <div className="tab-panel energy-panel">
    <h2 className="panel-header">Renewable Energy Metrics</h2>
    <div className="panel-content">
      <p className="panel-description">Monitor renewable energy production and usage across your facilities.</p>
      <div className="visualization-placeholder">
        Renewable energy data visualization would appear here
      </div>
    </div>
  </div>
);

const BiodiversityTracker = () => (
  <div className="tab-panel biodiversity-panel">
    <h2 className="panel-header">Biodiversity Impact</h2>
    <div className="panel-content">
      <p className="panel-description">Measure and track your organization's impact on local biodiversity and ecosystems.</p>
      <div className="visualization-placeholder">
        Biodiversity impact visualization would appear here
      </div>
    </div>
  </div>
);

const SustainabilityOverview = () => (
  <div className="tab-panel overview-panel">
    <h2 className="panel-header">Sustainability Overview</h2>
    <div className="panel-content">
      <p className="panel-description">Complete dashboard of all sustainability metrics and KPIs in one place.</p>
      <div className="dashboard-grid">
        <div className="dashboard-card card-carbon">
          <h3>Carbon Footprint</h3>
          <p className="metric">-12%</p>
          <p className="trend">Year over year</p>
        </div>
        <div className="dashboard-card card-water">
          <h3>Water Saved</h3>
          <p className="metric">8.2M</p>
          <p className="trend">Gallons this quarter</p>
        </div>
        <div className="dashboard-card card-energy">
          <h3>Renewable Usage</h3>
          <p className="metric">42%</p>
          <p className="trend">Of total energy</p>
        </div>
        <div className="dashboard-card card-waste">
          <h3>Waste Reduction</h3>
          <p className="metric">18%</p>
          <p className="trend">Less landfill</p>
        </div>
      </div>
    </div>
  </div>
);

function Analytics() {
  const [activeTab, setActiveTab] = useState("emissions");

  // Handler for tab changes
  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  return (
    <div className="analytics-container">
      

      <div className="tabs-container">
        <div className="tabs-nav">
          <button 
            className="tab-trigger" 
            data-value="overview" 
            data-state={activeTab === "overview" ? "active" : "inactive"}
            onClick={() => handleTabChange("overview")}
          >
            <BarChartIcon />
            <span>Overview</span>
          </button>
          <button 
            className="tab-trigger" 
            data-value="emissions" 
            data-state={activeTab === "emissions" ? "active" : "inactive"}
            onClick={() => handleTabChange("emissions")}
          >
            <LeafIcon />
            <span>Emissions</span>
          </button>
          <button 
            className="tab-trigger" 
            data-value="water" 
            data-state={activeTab === "water" ? "active" : "inactive"}
            onClick={() => handleTabChange("water")}
          >
            <DropletsIcon />
            <span>Water</span>
          </button>
          <button 
            className="tab-trigger" 
            data-value="energy" 
            data-state={activeTab === "energy" ? "active" : "inactive"}
            onClick={() => handleTabChange("energy")}
          >
            <SunIcon />
            <span>Energy</span>
          </button>
          <button 
            className="tab-trigger" 
            data-value="biodiversity" 
            data-state={activeTab === "biodiversity" ? "active" : "inactive"}
            onClick={() => handleTabChange("biodiversity")}
          >
            <WindIcon />
            <span>Biodiversity</span>
          </button>
        </div>

        <div className="tabs-content-container">
          <div className="tab-content" data-state={activeTab === "overview" ? "active" : "inactive"}>
            <SustainabilityOverview />
          </div>
          
          <div className="tab-content" data-state={activeTab === "emissions" ? "active" : "inactive"}>
            <div className="tab-panel emissions-panel">
              <h2 className="panel-header">Carbon Emissions Analytics</h2>
              <EmissionsTracker />
            </div>
          </div>
          
          <div className="tab-content" data-state={activeTab === "water" ? "active" : "inactive"}>
            <WaterUsageTracker />
          </div>
          
          <div className="tab-content" data-state={activeTab === "energy" ? "active" : "inactive"}>
            <RenewableEnergyTracker />
          </div>
          
          <div className="tab-content" data-state={activeTab === "biodiversity" ? "active" : "inactive"}>
            <BiodiversityTracker />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
