import React, { useState } from "react";

const EmissionsTracker = () => {
    const [vehicleType, setVehicleType] = useState("");
    const [distance, setDistance] = useState("");
    const [cargoWeight, setCargoWeight] = useState("");
    const [routeType, setRouteType] = useState("");
    const [emissions, setEmissions] = useState(null);

    const EMISSION_FACTORS_TTW = {
        truck_diesel: 0.1,
        train_diesel: 0.03,
        train_electric: 0.02,
        ship_heavy_fuel: 0.015,
        airplane_cargo: 0.5,
    };

    const EMISSION_FACTORS_WTW = {
        truck_diesel: 0.13,
        train_diesel: 0.05,
        train_electric: 0.025,
        ship_heavy_fuel: 0.02,
        airplane_cargo: 0.6,
    };

    const calculateEmission = () => {
        const ttwFactor = EMISSION_FACTORS_TTW[vehicleType];
        const wtwFactor = EMISSION_FACTORS_WTW[vehicleType];

        if (!ttwFactor || !wtwFactor) {
            alert("Invalid vehicle type or route type");
            return;
        }

        const emissionsTTW = (distance * cargoWeight * ttwFactor).toFixed(2);
        const emissionsWTW = (distance * cargoWeight * wtwFactor).toFixed(2);

        setEmissions({ ttw: emissionsTTW, wtw: emissionsWTW });
    };

    const containerStyle = {
        width: "500px",
        background: "rgba(144, 238, 144, 0.2)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "30px",
        boxShadow: "0 8px 24px rgba(0, 128, 0, 0.3)",
        textAlign: "left",
        animation: "fadeIn 0.8s ease-in-out"
    };

    const titleStyle = {
        fontSize: "26px",
        fontWeight: "700",
        textAlign: "center",
        marginBottom: "10px",
        color: "#006400"
    };

    const subtitleStyle = {
        fontSize: "15px",
        textAlign: "center",
        fontWeight: "400",
        opacity: "0.8",
        marginBottom: "20px",
        color: "#228B22"
    };

    const inputStyle = {
        width: "100%",
        padding: "12px",
        border: "1px solid rgba(0, 128, 0, 0.3)",
        borderRadius: "8px",
        background: "rgba(144, 238, 144, 0.3)",
        color: "black",
        fontSize: "15px",
        outline: "none"
    };

    const buttonStyle = {
        marginTop: "25px",
        width: "100%",
        padding: "14px",
        border: "none",
        borderRadius: "10px",
        background: "linear-gradient(135deg, #32CD32, #008000)",
        color: "white",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 6px 14px rgba(34, 139, 34, 0.3)"
    };

    const resultsSectionStyle = {
        marginTop: "25px",
        padding: "20px",
        borderRadius: "10px",
        background: "rgba(0, 100, 0, 0.3)",
        boxShadow: "0 6px 16px rgba(0, 100, 0, 0.2)",
        animation: "fadeIn 0.6s ease-in-out"
    };

    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>GHG Emissions Calculator</h1>
            <p style={subtitleStyle}>Calculate your freight transport emissions</p>
            
            <div>
                <label>Vehicle Type:</label>
                <select style={inputStyle} value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                    <option value="">Select</option>
                    <option value="truck_diesel">Truck (Diesel)</option>
                    <option value="train_diesel">Train (Diesel)</option>
                    <option value="train_electric">Train (Electric)</option>
                    <option value="ship_heavy_fuel">Ship (Heavy Fuel)</option>
                    <option value="airplane_cargo">Airplane (Cargo)</option>
                </select>
            </div>

            <div>
                <label>Distance (km):</label>
                <input style={inputStyle} type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
            </div>

            <div>
                <label>Cargo Weight (tons):</label>
                <input style={inputStyle} type="number" value={cargoWeight} onChange={(e) => setCargoWeight(e.target.value)} />
            </div>

            <div>
                <label>Route Type:</label>
                <select style={inputStyle} value={routeType} onChange={(e) => setRouteType(e.target.value)}>
                    <option value="">Select</option>
                    <option value="highway">Highway</option>
                    <option value="urban">Urban</option>
                    <option value="mountain">Mountain</option>
                    <option value="waterway">Waterway</option>
                    <option value="air">Air</option>
                </select>
            </div>

            <button style={buttonStyle} onClick={calculateEmission}>Calculate Emissions</button>
            
            {emissions && (
                <div style={resultsSectionStyle}>
                    <h3>Results:</h3>
                    <p>Tank-to-Wheel (TTW) Emissions: {emissions.ttw} kg CO2e</p>
                    <p>Well-to-Wheel (WTW) Emissions: {emissions.wtw} kg CO2e</p>
                </div>
            )}
        </div>
    );
};

export default EmissionsTracker;
