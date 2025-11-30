// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SSOPage from "./pages/SSOPage";
import RegisterProgram from "./pages/RegisterProgram";
import ScheduleManagement from "./pages/ScheduleManagement";
import ProgressPage from "./pages/ProgressPage";
import AppointmentPage from "./pages/AppointmentPage";
import ResourcePage from "./pages/ResourcePage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login-SSO" element={<SSOPage />} />
        <Route path="/dang-ky" element={<RegisterProgram />} />
        <Route path="/lich-hen" element={<ScheduleManagement/>} />
        <Route path="/tien-do" element={<ProgressPage/>} />
        <Route path="/buoi-ho-tro" element={<AppointmentPage/>} />
        <Route path="/tai-nguyen" element={<ResourcePage/>} />
      </Routes>
  );
}

export default App;
