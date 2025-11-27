import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SSO from "../components/SSO";

function SSOPage() {

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <SSO />
    </div>
  );
}

export default SSOPage;
