import React from "react";
import { Link } from "react-router-dom";

const Products = ({ name, price, image, about, id }) => {
  return (
    <>
      <Link to={`/preview/${id}`} style={{ textDecoration: "none" }}>
        <div className="product-design">
          <img className="product-image" src={image} alt={about} />
          <div className="product-info">
            <p className="product-name">{name}</p>
            {/*<p className="product-price">${price.toFixed(2)}</p>*/}
          </div>
        </div>
      </Link>
    </>
  );
};

export default Products;
