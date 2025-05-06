import React from "react";

const UploadProducts = ({
  id,
  name,
  about,
  image,
  category,
  price,
  deleteUpload,
}) => {
  return (
    <div className="upload-product-card">
      <img className="product-image" src={image} />
      <div className="product-info">
        <p className="product-name">{name}</p>
        {/*<p className="product-price">${price.toFixed(2)}</p>*/}
        <p>{about}</p>
        <p>{category}</p>
        <p>${price}</p>
      </div>
      <button onClick={() => deleteUpload(id)}>Delete</button>
    </div>
  );
};

export default UploadProducts;
