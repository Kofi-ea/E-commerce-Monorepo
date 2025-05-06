import React from "react";
import { useState, useEffect } from "react";
import UploadProducts from "./UploadProducts";
import { useAuth } from "./AuthContext";

const VendorDashboard = () => {
  const [yourUploads, setYourUploads] = useState([]);
  const { user, username } = useAuth();

  const fetchMyUploads = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/products?vendorId=${user.uid}`
      );
      const data = await response.json();
      setYourUploads(data);
    } catch (error) {
      console.log("Something went wrong with the fetching", error);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchMyUploads();
    }
  }, [user]);

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/products/${productId}`,
        {
          method: "DELETE",
        }
      );
      window.location.reload();
      toast.success("Product deleted successfully!");

      if (!response.ok) {
        throw new Error("Failed to delete the product.");
      }

      // Optionally: remove the deleted product from state
      setYourUploads((prevState) =>
        prevState.filter((p) => p.id !== productId)
      );
      console.log(
        productId,
        yourUploads.map((p) => p.id)
      );
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while deleting.");
    }
  };

  return (
    <>
      <div className="vendor-dashboard">
        <div className="upload-products-header">
          <h1>Welcome {username}</h1>
          <p>
            You have uploaded {yourUploads.length}{" "}
            {yourUploads.length > 1 ? "products" : "product"}{" "}
          </p>
        </div>

        <div className="upload-products-grid">
          {yourUploads.length === 0 ? (
            <p>No products uploaded yet.</p>
          ) : (
            yourUploads.map((upload) => {
              return (
                <UploadProducts
                  key={upload.id}
                  id={upload.id}
                  name={upload.title}
                  category={upload.category}
                  about={upload.description}
                  price={upload.price}
                  image={upload.image}
                  deleteUpload={handleDelete}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default VendorDashboard;
