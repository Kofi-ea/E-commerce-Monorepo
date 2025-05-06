import React from "react";
import { Link } from "react-router-dom";

const CartHeader = ({ cart }) => {
  return (
    <>
      <div className="heading">
        <div className="logo-container">
          <img className="logo" src="" alt="" />
          <ul className="menu">
            <Link to={"/"}>
              <li>Available</li>
            </Link>

            <li>Careers</li>
            <li>About</li>
          </ul>
        </div>
        <div className="cart-link">
          <li>
            Cart <span>( {cart.length} )</span>
          </li>
        </div>
      </div>
    </>
  );
};

export default CartHeader;
