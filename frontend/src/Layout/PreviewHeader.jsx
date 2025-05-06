import React from "react";
import { Link } from "react-router-dom";

const PreviewHeader = () => {
  return (
    <>
      <div className="heading" style={{ top: "0" }}>
        <div className="logo-container">
          <img className="logo" src="" alt="" />
          <ul className="menu">
            <Link to={"/"}>
              <li>Available</li>{" "}
            </Link>
            <li>Careers</li>
            <li>About</li>
          </ul>
        </div>
        <div className="cart-link">
          <Link to={"/cart"}>
            <li>Cart</li>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PreviewHeader;
