import React from "react";
import { useState, useEffect } from "react";
import UploadProductForm from "../Components/UploadProductForm";
import VendorPageHeader from "../Layout/VendorPageHeader";
import VendorDashboard from "../Components/VendorDashboard";
import Footer from "../Layout/Footer";

const VendorPage = () => {
  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <VendorPageHeader />
        <VendorDashboard />
        <UploadProductForm />
        <Footer />
      </div>
    </>
  );
};

export default VendorPage;
