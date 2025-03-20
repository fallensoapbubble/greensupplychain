// import logo from './logo.svg';
// import './App.css';

import React from "react";
import MainPage from "./pages/MainPage";
import { Routes, Route } from "react-router-dom";
import Analytics from "./pages/Analytics/Analytics";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <>
     
    
    <Routes>
    <Route path="/" element={<MainPage />} />
    <Route path="/analytics" element={<Analytics/>} />
    <Route path="/dashboard" element={<Dashboard/>} />
    </Routes>



    </>
  );
}

export default App;
