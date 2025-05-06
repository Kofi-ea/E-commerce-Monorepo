import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SignOut from "../Components/SignOut";

const Header = () => {
  const [showCollection, setShowCollection] = useState(false);

  function show() {
    setShowCollection((prevState) => !prevState);
  }

  return (
    <>
      <div className="heading">
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
          <SignOut />
        </div>
      </div>
    </>
  );
};

export default Header;
