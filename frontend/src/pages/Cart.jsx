// src/pages/Cart.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/Cart.css";
import {triggerDownloadFromBase64} from "../api/orderApi.js";

function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    total,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
  } = useCart();

  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation: all four fields must be non-empty
    if (!shippingAddress.trim() || !city.trim() || !postalCode.trim() || !paymentMethod) {
      alert("Please fill in all shipping and payment fields.");
      return;
    }
    if (!/^\d{4}$/.test(postalCode)) {
      alert("Postal code must be exactly 4 digits (e.g. 2000).");
      return;
    }

    setPlacingOrder(true);
    try {
      const {
        order: createdOrder,
        invoiceBase64,
        filename,
      } =await placeOrder({ shippingAddress, city, postalCode, paymentMethod });

      triggerDownloadFromBase64(filename, invoiceBase64);
      setShowConfirmation(true);
      setTimeout(() => navigate("/orders"), 2000);
    } catch {
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (showConfirmation) {
    return (
        <div className="order-confirmation">
          <div className="confirmation-message">
            <i className="bi bi-check-circle-fill"></i>
            <h3>Order Completed Successfully!</h3>
            <p>Thank you for your purchase. Redirecting to orders page…</p>
          </div>
        </div>
    );
  }

  return (
      <main className="container">
        <h2 className="cart-heading">Your Shopping Cart</h2>

        {loading ? (
            <div className="loading">Loading cart…</div>
        ) : cartItems.length === 0 ? (
            <div className="empty-cart-message">
              <i className="bi bi-cart" style={{ fontSize: "2.5rem" }}></i>
              <p className="mb-1">Your cart is empty.</p>
            </div>
        ) : showCheckoutForm ? (
            <form onSubmit={handleSubmit} className="checkout-form">
              <h4>Shipping Information</h4>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                    type="text"
                    id="address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="123 Main St"
                    required
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Sydney"
                    required
                />
              </div>
              <div className="form-group">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                    type="text"
                    id="postalCode"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="2000"
                    required
                />
              </div>

              <h4>Payment Method</h4>
              <div className="form-group">
                <label htmlFor="paymentMethod">Select a Method</label>
                <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                >
                  <option value="">-- Choose --</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <button type="submit" className="btn w-100" disabled={placingOrder}>
                {placingOrder ? "Placing Order…" : "Confirm Order"}
              </button>
            </form>
        ) : (
            <>
              <div className="cart-table-container">
                <table className="table">
                  <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {cartItems.map((item) => (
                      <tr key={item.sku}>
                        <td>
                          <div className="cart-item-info">
                            <img
                                src={item.image || "https://via.placeholder.com/80"}
                                alt={item.name}
                                className="cart-item-image"
                            />
                            <div className="cart-item-details">
                              <h6>{item.name}</h6>
                              <small className="text-muted">SKU: {item.sku}</small>
                            </div>
                          </div>
                        </td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>
                          <div className="quantity-controls">
                            <button
                                className="btn"
                                onClick={() => updateQuantity(item.sku, -1)}
                                disabled={item.quantity === 1}
                            >
                              <i className="bi bi-dash-circle"></i>
                            </button>
                            <span className="quantity-amount">{item.quantity}</span>
                            <button
                                className="btn"
                                onClick={() => updateQuantity(item.sku, 1)}
                            >
                              <i className="bi bi-plus-circle"></i>
                            </button>
                          </div>
                        </td>
                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <button
                              className="btn btn-outline-danger"
                              onClick={() => removeFromCart(item.sku)}
                          >
                            <i className="bi bi-trash"></i> Remove
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>

              <div className="cart-summary">
                <div className="cart-summary-row">
                  <h5>Total Items:</h5>
                  <span>{cartItems.length}</span>
                </div>
                <div className="cart-summary-row">
                  <h5>Total Amount:</h5>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button className="btn w-100" onClick={() => setShowCheckoutForm(true)}>
                  Proceed to Checkout
                </button>
                <button className="btn btn-sm btn-link text-danger" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            </>
        )}
      </main>
  );
}

export default Cart;
