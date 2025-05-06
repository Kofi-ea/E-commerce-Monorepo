import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../Components/AuthContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

const UploadProductForm = () => {
  const initialValues = {
    title: "",
    price: "",
    description: "",
    category: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);

  const [image, setImage] = useState(null);
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValues({ ...formValues, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload an image.");
      return;
    }

    const imageRef = ref(storage, `products/${Date.now()}_${image.name}`);

    const errors = validate(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    console.log(formValues);

    try {
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef); // Get the download URL of the uploaded image

      await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formValues,
          image: imageUrl,
          vendorId: user.uid,
        }),
      });
      toast.success("Your product has been uploaded to the store.");
      window.location.reload();
    } catch (error) {
      console.log("Upload was unsuccesful", error);
      toast.error("Upload error.Please try again");
    }
  };

  const validate = (inputs) => {
    const errors = {};

    const regex = /^[\w\.-]+@[\w-]+\.[\w-]{2,}$/;

    if (!inputs.title) {
      errors.title = "Product title is required";
    }

    if (!inputs.price) {
      errors.price = "Please indicate the price";
    }

    if (!inputs.description) {
      errors.description = "An accurate description is required";
    }

    if (!inputs.category) {
      errors.category = "Select a category for your product";
    }

    return errors;
  };
  return (
    <>
      <div className="upload-form-page">
        <div className="upload-form-container">
          <h3>Fill the form below to submit your product</h3>
          <form
            action="/api/products"
            onSubmit={handleSubmit}
            className="vendor-form"
            method="POST"
            enctype="multipart/form-data"
          >
            <div className="upload-field">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                name="title"
                value={formValues.title}
                placeholder="Product title"
                onChange={handleChange}
                className="upload-field-input"
              />
              <p style={{ color: "red" }}>{formErrors.title}</p>
            </div>
            <div className="upload-field">
              <label htmlFor="image-upload">Upload Image:</label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="upload-field-input"
              />
            </div>

            <div className="upload-field">
              <label htmlFor="price">Price:</label>
              <input
                type="text"
                name="price"
                placeholder="Price"
                value={formValues.price}
                onChange={handleChange}
                className="upload-field-input"
              />
              <p style={{ color: "red" }}>{formErrors.price}</p>
            </div>
            <div className="upload-field">
              <label htmlFor="description">Description:</label>
              <textarea
                name="description"
                id="description"
                placeholder="Description"
                value={formValues.description}
                onChange={handleChange}
              ></textarea>
              <p style={{ color: "red" }}>{formErrors.description}</p>
            </div>
            <div className="upload-field">
              <label htmlFor="category"></label>
              <select
                name="category"
                id="category"
                value={formValues.category}
                onChange={handleChange}
              >
                <option>Select Category</option>
                <option value="men's clothing">men's clothing</option>
                <option value="jewelery">jewelery</option>
                <option value="women's clothing">women's clothing</option>
                <option value="electronics">electronics</option>
              </select>
              <p style={{ color: "red" }}>{formErrors.category}</p>
            </div>
            <button type="submit" className="upload-button">
              Upload
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UploadProductForm;
