import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import CatalogBar from "../components/CatalogBar";
import AppointmentFunctions from "../components/AppointmentFunctions";

function AppointmentPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      // Nếu chưa đăng nhập, chuyển về trang login-SSO
      navigate("/login-SSO");
    }
  }, [navigate]);

  if (!isLoggedIn) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <CatalogBar activeCategory="/buoi-ho-tro" />

      {/* Nội dung chính */}
      <AppointmentFunctions />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AppointmentPage;
