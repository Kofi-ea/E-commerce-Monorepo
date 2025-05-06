import React from "react";
import { useState, useEffect } from "react";
import { useParams, Routes, Route } from "react-router-dom";
import Loading from "../Components/Loading";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import PreviewHeader from "../Layout/PreviewHeader";
import Footer from "../Layout/Footer";
import AddToCartBtn from "./AddToCartBtn";
import WindowSize from "../Components/WindowSize";

const preview = () => {
  const { id } = useParams();
  const [info, setInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const { width } = WindowSize();
  const [fullDescription, setFullDescription] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);

        const data = await response.json();
        // console.log(data);

        if (!response.ok) {
          throw Error("Did not receive any data");
        }
        setInfo(data);
      } catch (error) {
        console.log("Something went wrong", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const addToCart = (info) => {
    // setIsAdded((prevState) => !prevState);

    try {
      // get the existing cart or use an empty array if not found
      const prevCart = JSON.parse(localStorage.getItem("cart")) || [];

      // Check if the product is already in the cart by checking product ID
      const isProductInCart = prevCart.some((item) => item.id === info.id);

      if (!isProductInCart) {
        // If the product isn't already in the cart, add it to the cart
        const updatedInfo = { ...info, quantity: 1 };
        const updatedCart = [...prevCart, updatedInfo];

        // Save the updated cart back to localStorage
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        // Update the state to reflect the changes
        setCart(updatedCart);
        setIsActive(!isActive);
        setAdding(true);

        setTimeout(() => {
          setShowAdded(true);
          setTimeout(() => {
            setShowAdded(false);
          }, 2800);
        }, 1500);
      } else {
        alert("Product already in cart");
      }
    } catch (error) {
      console.error("Error while adding item to cart:", error);
    }
  };

  let description = info.description;

  const showFullDescription = () => {
    setFullDescription((prevState) => {
      return !prevState;
    });
  };

  return (
    <>
      <PreviewHeader />
      {isLoading ? (
        <Loading />
      ) : (
        <div style={{ minHeight: "100vh", marginTop: "100px" }}>
          <p className={`added-msg ${showAdded ? "active" : ""}`}>
            {showAdded ? `Your item has been added to cart` : ""}
          </p>
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <button className="back-btn">
              <FaArrowLeft />
              Back
            </button>
          </Link>

          <div className="preview">
            <div className="preview-img-box">
              <img className="preview-img" src={info.image} alt={info.title} />
            </div>
            <aside>
              <div className="info">
                <h2 className="info-title">{info.title}</h2>
                {/*<p style={{ lineHeight: "2.3", fontWeight: "bold" }}>
                  *price: ${info.price.toFixed(2)}
                </p>*/}
                <p
                  style={{
                    lineHeight: "1.3",
                    fontStyle: "italic",
                    fontWeight: "bold",
                  }}
                >
                  {/* {width && width < 650
                    ? info.description.substring(0, 100) + "..."
                    : info.description} */}
                  {/*{!fullDescription
                    ? description.substring(0, 100) + "..."
                    : description + "."}{" "} */}
                  <button
                    onClick={showFullDescription}
                    className="show-description-btn"
                  >
                    {!fullDescription ? "more" : "less"}
                  </button>
                </p>
                <p
                  style={{
                    lineHeight: "1.5",
                    fontWeight: "bold",
                    marginTop: "10px",
                  }}
                >
                  *category: {info.category}
                </p>
                {/*<p style={{ lineHeight: "1.3", fontWeight: "bold" }}>
                  *ratings: {info.rating.rate}
                </p>
                <p style={{ lineHeight: "1.3", fontWeight: "bold" }}>
                  *stock left: {info.rating.count}
                </p> */}
              </div>
              <AddToCartBtn add={() => addToCart(info)} productId={info.id} />
              {/* <button
                onClick={() => addToCart(info)}
                className={isActive && "active"}
              >
                {!isAdded ? "Add To Cart" : "Added"}
              </button> */}
            </aside>
          </div>
        </div>
      )}

      {/* <Routes>
        <Route
          path="/cart"
          element={<CartPage cart={cart} setCart={setCart} />}
        />
      </Routes> */}

      <Footer />
    </>
  );
};

export default preview;
