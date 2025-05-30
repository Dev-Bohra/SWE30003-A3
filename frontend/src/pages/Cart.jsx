import React, { useState } from 'react';
import '../styles/Cart.css';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, total, updateQuantity, removeFromCart } = useCart();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    shippingAddress: '',
    city: '',
    postalCode: '',
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the order submission
    console.log('Order submitted:', { ...formData, items: cartItems, total });
  };

  const CheckoutForm = () => (
    <div className="checkout-form-container">
      <h3 className="checkout-title">Complete Your Order</h3>
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-section">
          <h4 className="section-title">Personal Information</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Full Name</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4 className="section-title">Shipping Information</h4>
          <div className="form-group">
            <label htmlFor="shippingAddress">Shipping Address</label>
            <textarea
              id="shippingAddress"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleInputChange}
              placeholder="Enter your complete shipping address"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter your city"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Enter postal code"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4 className="section-title">Payment Method</h4>
          <div className="payment-options">
            <div className="payment-option">
              <input
                type="radio"
                id="credit_card"
                name="paymentMethod"
                value="credit_card"
                checked={formData.paymentMethod === 'credit_card'}
                onChange={handleInputChange}
              />
              <label htmlFor="credit_card" className="payment-label">
                <i className="bi bi-credit-card"></i>
                Credit Card
              </label>
            </div>
            <div className="payment-option">
              <input
                type="radio"
                id="paypal"
                name="paymentMethod"
                value="paypal"
                checked={formData.paymentMethod === 'paypal'}
                onChange={handleInputChange}
              />
              <label htmlFor="paypal" className="payment-label">
                <i className="bi bi-paypal"></i>
                PayPal
              </label>
            </div>
            <div className="payment-option">
              <input
                type="radio"
                id="bank_transfer"
                name="paymentMethod"
                value="bank_transfer"
                checked={formData.paymentMethod === 'bank_transfer'}
                onChange={handleInputChange}
              />
              <label htmlFor="bank_transfer" className="payment-label">
                <i className="bi bi-bank"></i>
                Bank Transfer
              </label>
            </div>
          </div>

          {formData.paymentMethod === 'credit_card' && (
            <div className="credit-card-details">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cardExpiry">Expiry Date</label>
                  <input
                    type="text"
                    id="cardExpiry"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cardCVC">CVC</label>
                  <input
                    type="text"
                    id="cardCVC"
                    name="cardCVC"
                    value={formData.cardCVC}
                    onChange={handleInputChange}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="order-summary">
          <h4 className="section-title">Order Summary</h4>
          <div className="summary-row">
            <span>Total Items:</span>
            <span>{cartItems.length}</span>
          </div>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn back-btn" onClick={() => setShowCheckoutForm(false)}>
            <i className="bi bi-arrow-left"></i>
            Back to Cart
          </button>
          <button type="submit" className="btn confirm-btn">
            <i className="bi bi-check-circle"></i>
            Confirm Order
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <main className="container">
      <h2 className="cart-heading">Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart-message">
          <i className="bi bi-cart" style={{ fontSize: '2.5rem' }}></i>
          <p className="mb-1">Your cart is currently empty.</p>
          <p className="text-muted small">Add some products to your cart to see them here.</p>
        </div>
      ) : showCheckoutForm ? (
        <CheckoutForm />
      ) : (
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
              {cartItems.map(item => (
                <tr key={item._id}>
                  <td>
                    <div className="cart-item-info">
                      <img src={item.image} alt={item.name} className="cart-item-image" />
                      <div className="cart-item-details">
                        <h6>{item.name}</h6>
                        <small className="text-muted">ID: {item._id.slice(-6)}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="price-column">${item.price.toFixed(2)}</span>
                  </td>
                  <td>
                    <div className="quantity-controls">
                      <button 
                        className="btn" 
                        onClick={() => updateQuantity(item._id, -1)} 
                        disabled={item.quantity === 1}
                        aria-label="Decrease quantity"
                        title="Decrease quantity"
                      >
                        <i className="bi bi-dash-circle" style={{ fontSize: '1.2rem' }}></i>
                      </button>
                      <span className="quantity-amount">{item.quantity}</span>
                      <button 
                        className="btn" 
                        onClick={() => updateQuantity(item._id, 1)}
                        aria-label="Increase quantity"
                        title="Increase quantity"
                      >
                        <i className="bi bi-plus-circle" style={{ fontSize: '1.2rem' }}></i>
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className="price-column">${(item.price * item.quantity).toFixed(2)}</span>
                  </td>
                  <td>
                    <button 
                      className="btn-outline-danger" 
                      onClick={() => removeFromCart(item._id)}
                      aria-label="Remove item"
                      title="Remove item"
                    >
                      <i className="bi bi-trash"></i>
                      <i className="bi bi-trash-fill hover-icon"></i>
                      <span>Remove</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <div className="cart-summary-row">
              <h5>
                <i className="bi bi-bag"></i>
                Total Items
              </h5>
              <span className="fw-semibold" style={{ fontSize: '1.1rem' }}>{cartItems.length}</span>
            </div>
            <div className="cart-summary-row">
              <h5>
                <i className="bi bi-tag"></i>
                Total Amount
              </h5>
              <span className="total-price">${total.toFixed(2)}</span>
            </div>
            <button className="btn w-100" onClick={() => setShowCheckoutForm(true)}>
              <i className="bi bi-lock"></i>
              <i className="bi bi-unlock hover-icon"></i>
              <span>Proceed to Checkout</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Cart; 