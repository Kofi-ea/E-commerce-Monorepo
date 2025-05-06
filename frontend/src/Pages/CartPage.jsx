import React, { useState } from "react";
import { useEffect } from "react";
import CartHeader from "../Layout/CartHeader";
import Footer from "../Layout/Footer";
import { FaCircleXmark, FaSquarePlus, FaSquareMinus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import CheckoutModal from "../Components/CheckoutModal";
import { useNavigate } from "react-router-dom";
import WindowSize from "../Components/WindowSize";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [wantsCheckout, setWantsCheckOut] = useState(false);
  const navigate = useNavigate();
  const { width } = WindowSize();

  // if (!cart) {
  //   return <p>Loading cart...</p>;
  // }

  useEffect(() => {
    // Fetch the cart from local storage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItemFromCart = (itemToRemove) => {
    const updatedCart = cart.filter((info) => info.id !== itemToRemove.id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    localStorage.removeItem(`added-${itemToRemove.id}`);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const taxRate = 0.1; // 10% tax
    return subtotal * taxRate;
  };
  const subtotal = calculateSubtotal();
  const taxRate = 0.1; // 10% tax
  const tax = (subtotal * taxRate).toFixed(2);
  // console.log(tax);

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    return subtotal + tax;
  };

  function proceedToCheckout() {
    return setWantsCheckOut((prevState) => !prevState);
  }
  const placeOrder = () => {
    navigate("/orders", { state: { cartItems: cart, tax } });
  };

  return (
    <>
      {wantsCheckout && (
        <CheckoutModal
          close={proceedToCheckout}
          cart={cart}
          setCart={setCart}
          subtotal={calculateSubtotal()}
          tax={calculateTax().toFixed(2)}
          orderTotal={calculateGrandTotal().toFixed(2)}
          placeOrder={placeOrder}
        />
      )}
      <CartHeader cart={cart} />
      {cart.length == 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-msg">
            <p>Your Cart is Empty</p>
            <Link to={"/"}>
              <button>Shop Now!!!</button>{" "}
            </Link>
          </div>
        </div>
      ) : (
        <div className="cart-page">
          <h2 className="cart-title">
            Your Shopping Cart has {cart.length}{" "}
            {cart.length > 1 ? "items" : "item"}
          </h2>

          <div className="cart-group">
            <div className="cart-item">
              <div className="table-header">
                <p style={{ width: "30%" }}>Product</p>
                <p style={{ width: "5%" }}>Price</p>
                <p
                  style={{
                    width: "10%",

                    textAlign: "center",
                  }}
                >
                  Quantity
                </p>
                <p style={{ width: "14%" }}>Total</p>
              </div>

              {cart.map((info) => (
                <div key={info.title} className="cart-item-info">
                  <div className="product">
                    <img
                      src={info.image}
                      alt={info.title}
                      className="cart-item-img"
                    />
                    <p>
                      {width && width < 650
                        ? info.title.substring(0, 23) + "..."
                        : info.title}
                      {/* {info.title} */}
                    </p>
                  </div>

                  {width && width < 650 ? (
                    <>
                      <p className="price">
                        <span> Price: </span>${info.price}
                      </p>
                      <p className="quantity">
                        Quantity:
                        <span
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            fontSize: "1.4rem",
                          }}
                        >
                          <FaSquareMinus
                            onClick={() => decreaseQuantity(info.id)}
                            style={{ cursor: "pointer" }}
                          />
                          <span
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            {info.quantity}
                          </span>
                          <FaSquarePlus
                            onClick={() => increaseQuantity(info.id)}
                            style={{ cursor: "pointer" }}
                          />
                        </span>
                      </p>
                      <div className="total">
                        <p>
                          <span style={{ marginRight: "10px" }}>Subtotal:</span>
                          ${info.quantity.toFixed(2) * info.price.toFixed(2)}
                        </p>
                        <FaCircleXmark
                          onClick={() => removeItemFromCart(info)}
                          style={{ cursor: "pointer", fontSize: "1.6rem" }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="price">${info.price}</p>
                      <p className="quantity">
                        <FaSquareMinus
                          onClick={() => decreaseQuantity(info.id)}
                          style={{ cursor: "pointer" }}
                        />
                        {info.quantity}
                        <FaSquarePlus
                          onClick={() => increaseQuantity(info.id)}
                          style={{ cursor: "pointer" }}
                        />
                      </p>
                      <div className="total">
                        <p>
                          ${info.quantity.toFixed(2) * info.price.toFixed(2)}
                        </p>
                        <FaCircleXmark
                          onClick={() => removeItemFromCart(info)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mini-checkout-box">
            <div className="mini-checkout">
              <div className="subtotal">
                <p style={{ fontWeight: "bold" }}>Subtotal:</p>
                <p>${calculateSubtotal().toFixed(2)}</p>
              </div>
              <div className="tax">
                <p style={{ fontWeight: "bold" }}>Sales Tax:</p>
                <p>${calculateTax().toFixed(2)}</p>
              </div>
              <div className="discount">
                <p style={{ fontWeight: "bold" }}>Coupon Code:</p>
                <Link to={"#"} style={{ textDecoration: "none" }}>
                  Add Coupon
                </Link>
              </div>
              <div className="grand-total">
                <p style={{ fontWeight: "bold", fontSize: "1.8rem" }}>
                  Grand Total:
                </p>
                <p style={{ fontSize: "1.8rem" }}>
                  ${calculateGrandTotal().toFixed(2)}
                </p>
              </div>
              <div className="checkout-btns">
                <button
                  style={{ backgroundColor: "white", color: "black" }}
                  onClick={proceedToCheckout}
                  className="proceed-to-checkout-btn"
                >
                  Proceed to checkout
                </button>
                <p style={{ margin: "10px 0px" }}>OR</p>
                <Link to={"/"}>
                  <button
                    style={{
                      backgroundColor: "black",
                      color: "white",
                    }}
                    className="continue-shopping-btn"
                  >
                    Continue shopping!!!
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer cart={cart} />
    </>
  );
};

export default CartPage;
