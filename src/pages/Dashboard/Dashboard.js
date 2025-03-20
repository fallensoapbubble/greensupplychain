import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Green Supply Chain Dashboard</h1>
            </header>
            <main className="dashboard-content">
                <section className="dashboard-section">
                    <h2>Carbon Emissions</h2>
                    <p>Track and reduce your carbon footprint across the supply chain.</p>
                </section>
                <section className="dashboard-section">
                    <h2>Energy Usage</h2>
                    <p>Monitor energy consumption and optimize for sustainability.</p>
                </section>
                <section className="dashboard-section">
                    <h2>Recycling Metrics</h2>
                    <p>Analyze recycling rates and improve waste management.</p>
                </section>
            </main>
            <footer className="dashboard-footer">
                <p>&copy; 2023 Green Supply Chain</p>
            </footer>
        </div>
    );
};

export default Dashboard;