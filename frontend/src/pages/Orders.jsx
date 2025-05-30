import React, { useState, useEffect } from 'react';
import '../styles/Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    // Load orders from localStorage
    const fetchOrders = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        setOrders(mockOrders);
      } catch (error) {
        setError('Error loading orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status.toLowerCase() === filter.toLowerCase();
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortBy === 'total') {
      return b.total - a.total;
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      
      <div className="orders-controls">
        <div className="filter-control">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select 
            id="status-filter" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="order-select-control"
          >
            <option value="all">All Orders</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <div className="sort-control">
          <label htmlFor="sort-by">Sort by:</label>
          <select 
            id="sort-by" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="order-select-control"
          >
            <option value="date">Date</option>
            <option value="total">Total Amount</option>
          </select>
        </div>
      </div>

      {sortedOrders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found.</p>
        </div>
      ) : (
        <div className="orders-list">
          {sortedOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="order-details">
                <div className="customer-info">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {order.customerInfo.name}</p>
                  <p><strong>Email:</strong> {order.customerInfo.email}</p>
                  <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                  <p><strong>Address:</strong> {order.customerInfo.shippingAddress}</p>
                  <p><strong>City:</strong> {order.customerInfo.city}</p>
                  <p><strong>Postal Code:</strong> {order.customerInfo.postalCode}</p>
                </div>

                <div className="order-items">
                  <h4>Order Items</h4>
                  {order.items.map(item => (
                    <div key={item._id} className="order-item">
                      <img src={item.image} alt={item.name} className="item-image" />
                      <div className="item-details">
                        <h5>{item.name}</h5>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <h4>Order Summary</h4>
                  <div className="summary-row">
                    <span>Total Items:</span>
                    <span>{order.items.length}</span>
                  </div>
                  <div className="summary-row">
                    <span>Total Amount:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Payment Method:</span>
                    <span>{order.paymentMethod.replace('_', ' ').toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
