import React, { useState } from "react";
import { useEffect } from "react";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import { useLocation } from "react-router-dom";
import WindowSize from "../Components/WindowSize";

const OrderPage = () => {
  const location = useLocation();
  const { width } = WindowSize();
  // const { cart } = location.state || {};
  // console.log(location);
  // const cart = location.state ? location.state.cart : [];
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page
  }, []);

  const cart = Array.isArray(location.state?.cartItems)
    ? location.state.cartItems
    : [];
  const tax = Number(location.state?.tax || 0);

  const date = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const fullDate = date.toLocaleDateString("en-US", options);

  function generateOrderId(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
  let randomId = generateOrderId(10);

  const totalPrice = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const orderPriceTotal = (totalPrice + tax).toFixed(2);

  return (
    <>
      <Header />

      <div className="order-page">
        <h1 style={{ textAlign: "center", fontFamily: "arial" }}>
          Your Orders
        </h1>
        <div className="order-list">
          <div className="order-details-header">
            <p>Ordered on : {fullDate}</p>
            <p>Total: ${orderPriceTotal}</p>
            {cart.length < 1 ? <p>Order Id: </p> : <p>Order Id: {randomId}</p>}
          </div>

          {cart && cart.length > 0 ? (
            cart.map((order) => {
              return (
                // Add return here to return JSX
                <div className="order-details" key={order.id}>
                  {" "}
                  <div className="order-desc">
                    <img src={order.image} alt={order.title} />
                    <div className="order-desc-info">
                      <p>
                        {width && width < 550
                          ? order.title.substring(0, 10) + "..."
                          : order.title}
                      </p>{" "}
                      <p>Quantity : {order.quantity}</p>{" "}
                      <p>Price : ${order.price}</p>
                    </div>
                  </div>
                  <div>${(order.price * order.quantity).toFixed(2)}</div>{" "}
                </div>
              );
            })
          ) : (
            <p>No Orders</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderPage;
