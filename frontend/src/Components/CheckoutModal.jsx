import React from "react";
// import { Link } from "react-router-dom";
import { FaTrashCan, FaPen } from "react-icons/fa6";

const CheckoutModal = ({
  close,
  cart,
  setCart,
  subtotal,
  tax,
  orderTotal,
  placeOrder,
}) => {
  // const navigate = useNavigate();

  const removeItemFromCart = (itemToRemove) => {
    const updatedCart = cart.filter((info) => info.id !== itemToRemove.id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  console.log(Array.isArray(cart));
  console.log(cart);

  return (
    <>
      <div className="checkout-modal">
        <p className="checkout-modal-title">Welcome to Checkout</p>

        <div className="checkout-summary">
          <div className="review-order">
            {cart.map((info) => (
              <div key={info.title} className="review-order-div">
                <div className="review-product">
                  <img src={info.image} alt={info.title} />
                  <p>{info.title}</p>
                </div>

                <div className="review-product-aside">
                  <p>Price: ${info.price}</p>
                  <p>Quantity: {info.quantity}</p>
                  <div>
                    <p>
                      Total: ${info.quantity.toFixed(2) * info.price.toFixed(2)}
                    </p>
                    <div className="edit-btns">
                      <button onClick={close} className="update-item-btn">
                        <FaPen />
                      </button>

                      <button
                        onClick={() => removeItemFromCart(info)}
                        className="remove-item-btn"
                      >
                        <FaTrashCan />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="order-summary">
            <h1 className="heading-order-summary">Order Summary</h1>

            <div className="order-info">
              <div className="items">
                <p>Items ({cart.length}) :</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>

              <div className="before-tax">
                <p>Total before Tax: </p>
                <p>${subtotal.toFixed(2)}</p>
              </div>

              <div className="estimated-tax">
                <p>Estimated Tax: </p>
                <p>${tax}</p>
              </div>
            </div>

            <div className="order-total">
              <p>Order Total : </p>
              <p>${orderTotal}</p>
            </div>

            <button className="order-btn" onClick={placeOrder}>
              Place your order
            </button>
          </div>
        </div>
        <div className="close-checkout-btn-box">
          <button onClick={close}>close checkout</button>
        </div>
      </div>
    </>
  );
};

export default CheckoutModal;
