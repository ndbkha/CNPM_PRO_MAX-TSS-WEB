// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SSOPage from "./pages/SSOPage";
import RegisterProgram from "./pages/RegisterProgram";

function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login-SSO" element={<SSOPage />} />
        <Route path="/dang-ky" element={<RegisterProgram />} />
      </Routes>
  );
}

export default App;
