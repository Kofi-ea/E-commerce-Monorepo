import React from "react";
import { useState, useEffect } from "react";

const AddToCartBtn = ({ add, productId }) => {
  //   const [isAdded, setIsAdded] = useState(false);

  const [isAdded, setIsAdded] = useState(() => {
    const savedState = localStorage.getItem(`added-${productId}`);

    return savedState === "true" ? true : false; // Parse saved state from localStorage
  });

  const handleClick = () => {
    add();

    // Then set the state to disable the button and change text

    setTimeout(() => {
      setIsAdded(true);
    }, 1500);

    localStorage.setItem(`added-${productId}`, "true");
  };
  return (
    <>
      <button
        onClick={handleClick}
        // disabled={isAdded}
        className={`add-to-cart-btn ${isAdded ? "added" : ""}`}
      >
        {isAdded ? "Added" : "Add to cart"}
      </button>
    </>
  );
};

export default AddToCartBtn;
