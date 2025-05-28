import React from 'react';
import '../styles/Cart.css';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, total, updateQuantity, removeFromCart } = useCart();

  return (
    <main className="container">
      <h2 className="cart-heading">Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart-message">
          <i className="bi bi-cart" style={{ fontSize: '2.5rem' }}></i>
          <p className="mb-1">Your cart is currently empty.</p>
          <p className="text-muted small">Add some products to your cart to see them here.</p>
        </div>
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
            <button className="btn w-100">
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