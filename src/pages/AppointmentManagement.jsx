import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import CatalogBar from "../components/CatalogBar";
import AppointmentFunctions from "../components/AppointmentFunctions";

function AppoinmentManagement() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <CatalogBar activeCategory="/lich-hen" />

      {/* Nội dung chính */}
      <AppointmentFunctions />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AppoinmentManagement;
