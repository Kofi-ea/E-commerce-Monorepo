import React from "react";
import { Link } from "react-router-dom";
import SignOut from "../Components/SignOut";

const VendorPageHeader = () => {
  return (
    <>
      <div className="heading">
        <div className="logo-container">
          <img className="logo" src="" alt="" />
        </div>

        <SignOut />
      </div>
    </>
  );
};

export default VendorPageHeader;
