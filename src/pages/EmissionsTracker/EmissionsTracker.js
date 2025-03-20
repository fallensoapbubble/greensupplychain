import React, { useState } from "react";
import './EmissionsTracker.css';



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

    const FUEL_EFFICIENCY = {
        truck_diesel: 30,
        train_diesel: 10,
        train_electric: 5,
        ship_heavy_fuel: 8,
        airplane_cargo: 40,
    };

    const LOAD_FACTORS = {
        truck_diesel: 0.8,
        train_diesel: 0.7,
        train_electric: 0.75,
        ship_heavy_fuel: 0.85,
        airplane_cargo: 0.6,
    };

    const ROUTE_FACTORS = {
        highway: 1.0,
        urban: 1.2,
        mountain: 1.5,
        waterway: 1.1,
        air: 1.0,
    };

    const calculateEmission = () => {
        const ttwFactor = EMISSION_FACTORS_TTW[vehicleType];
        const wtwFactor = EMISSION_FACTORS_WTW[vehicleType];
        const efficiency = FUEL_EFFICIENCY[vehicleType];
        const loadFactor = LOAD_FACTORS[vehicleType];
        const routeFactor = ROUTE_FACTORS[routeType] || 1.0;

        if (!ttwFactor || !wtwFactor || !efficiency || !loadFactor) {
            alert("Invalid vehicle type or route type");
            return;
        }

        const adjustedDistance = distance * routeFactor;
        const effectiveWeight = cargoWeight / loadFactor;

        const emissionsTTW = (adjustedDistance * effectiveWeight * ttwFactor).toFixed(2);
        const emissionsWTW = (adjustedDistance * effectiveWeight * wtwFactor).toFixed(2);

        setEmissions({ ttw: emissionsTTW, wtw: emissionsWTW });
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>GHG Emissions Calculator</h1>
            <div style={{ marginBottom: "10px" }}>
                <label>
                    Vehicle Type:
                    <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        style={{ marginLeft: "10px" }}
                    >
                        <option value="">Select</option>
                        <option value="truck_diesel">Truck (Diesel)</option>
                        <option value="train_diesel">Train (Diesel)</option>
                        <option value="train_electric">Train (Electric)</option>
                        <option value="ship_heavy_fuel">Ship (Heavy Fuel)</option>
                        <option value="airplane_cargo">Airplane (Cargo)</option>
                    </select>
                </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>
                    Distance (km):
                    <input
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        style={{ marginLeft: "10px" }}
                    />
                </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>
                    Cargo Weight (tons):
                    <input
                        type="number"
                        value={cargoWeight}
                        onChange={(e) => setCargoWeight(e.target.value)}
                        style={{ marginLeft: "10px" }}
                    />
                </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>
                    Route Type:
                    <select
                        value={routeType}
                        onChange={(e) => setRouteType(e.target.value)}
                        style={{ marginLeft: "10px" }}
                    >
                        <option value="">Select</option>
                        <option value="highway">Highway</option>
                        <option value="urban">Urban</option>
                        <option value="mountain">Mountain</option>
                        <option value="waterway">Waterway</option>
                        <option value="air">Air</option>
                    </select>
                </label>
            </div>
            <button onClick={calculateEmission} style={{ marginTop: "10px" }}>
                Calculate Emissions
            </button>
            {emissions && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Results:</h3>
                    <p>Tank-to-Wheel (TTW) Emissions: {emissions.ttw} kg CO2e</p>
                    <p>Well-to-Wheel (WTW) Emissions: {emissions.wtw} kg CO2e</p>
                </div>
            )}
        </div>
    );
};

export default EmissionsTracker;