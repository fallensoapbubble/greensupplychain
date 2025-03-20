

import React from "react";
import MainPage from "./pages/MainPage";
import { Routes, Route } from "react-router-dom";
import Analytics from "./pages/Analytics/Analytics";
import Dashboard from "./pages/Dashboard/Dashboard";
import Inventory from "./pages/Inventory/Inventory";
import RouteManager from "./pages/RouteManager/RouteManager";

function App() {
  return (
    <>
     
    
    <Routes>
    <Route path="/" element={<MainPage />} />
    <Route path="/analytics" element={<Analytics/>} />
    <Route path="/dashboard" element={<Dashboard/>} />
    <Route path="/inventory" element={<Inventory />} />
    <Route path="/routemanager" element={<RouteManager />} />
    </Routes>



    </>
  );
}

export default App;
