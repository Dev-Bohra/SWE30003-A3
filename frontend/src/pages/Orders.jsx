// src/pages/Orders.jsx
import React, { useState, useEffect } from "react";
import "../styles/Orders.css";
import { useAuth } from "../context/AuthContext";
import { fetchOrdersApi } from "../api/orderApi";

function Orders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        // Simulate same 1s delay if you want; optional
        await new Promise((resolve) => setTimeout(resolve, 500));
        const fetched = await fetchOrdersApi(currentUser.id);
        setOrders(fetched);
      } catch (err) {
        console.error("Error loading orders:", err);
        setError("Error loading orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  // Adapt backend order → template’s order shape
  const adaptedOrders = orders.map((o) => {
    // 1) id
    const id = o.orderId;
    // 2) date (for sorting/display)
    const date = o.createdAt ? new Date(o.createdAt) : null;
    // 3) status
    const status = o.status || "UNKNOWN";
    // 4) total
    const total = o.total ?? 0;

    // 5) customerInfo: since backend stores only shipping, pull name/email from currentUser
    const customerInfo = {
      name: currentUser?.firstName
          ? `${currentUser.firstName} ${currentUser.lastName}`
          : "Unknown Customer",
      email: currentUser?.email ?? "",
      phone: currentUser?.phone ?? "",
      shippingAddress: o.shippingAddress || "",
      city: o.city || "",
      postalCode: o.postalCode || "",
    };

    // 6) items: map from o.orderItems → { _id, image, name, price, quantity }
    const items = Array.isArray(o.orderItems)
        ? o.orderItems.map((oi) => ({
          _id: oi.product?.sku || Math.random().toString(),
          image: oi.product?.imageUrl || "",
          name: oi.product?.name || "Unnamed Product",
          price: oi.product?.price ?? 0,
          quantity: oi.quantity ?? 0,
        }))
        : [];

    // 7) paymentMethod
    const paymentMethod = o.paymentMethod || "";

    return { id, date, status, total, customerInfo, items, paymentMethod };
  });

  // Filter logic
  const filteredOrders = adaptedOrders.filter((order) => {
    if (filter === "all") return true;
    return order.status.toLowerCase() === filter.toLowerCase();
  });

  // Sort logic
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "date") {
      if (a.date && b.date) return b.date - a.date;
      return 0;
    }
    if (sortBy === "total") {
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
      <main className= "container mt-5">
      <div className="container mt-5">
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
              <option value="paid">Paid</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="payment_failed">Payment Failed</option>
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
              {sortedOrders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h3>Order #{order.id}</h3>
                        <p className="order-date">
                          {order.date
                              ? order.date.toLocaleDateString()
                              : "Date unknown"}
                        </p>
                      </div>
                      <div className="order-status">
                  <span
                      className={`status-badge ${order.status.toLowerCase()}`}
                  >
                    {order.status.replace("_", " ").toUpperCase()}
                  </span>
                      </div>
                    </div>

                    <div className="order-details">
                      <div className="customer-info">
                        <h4>Customer Information</h4>
                        <p>
                          <strong>Name:</strong> {order.customerInfo.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {order.customerInfo.email}
                        </p>
                        {order.customerInfo.phone && (
                            <p>
                              <strong>Phone:</strong> {order.customerInfo.phone}
                            </p>
                        )}
                        <p>
                          <strong>Address:</strong>{" "}
                          {order.customerInfo.shippingAddress}
                        </p>
                        <p>
                          <strong>City:</strong> {order.customerInfo.city}
                        </p>
                        <p>
                          <strong>Postal Code:</strong>{" "}
                          {order.customerInfo.postalCode}
                        </p>
                      </div>

                      <div className="order-items">
                        <h4>Order Items</h4>
                        {order.items.length === 0 ? (
                            <p>No items in this order.</p>
                        ) : (
                            order.items.map((item) => (
                                <div key={item._id} className="order-item">
                                  {item.image ? (
                                      <img
                                          src={item.image}
                                          alt={item.name}
                                          className="item-image"
                                      />
                                  ) : (
                                      <div className="item-image-placeholder" />
                                  )}
                                  <div className="item-details">
                                    <h5>{item.name}</h5>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: ${item.price.toFixed(2)}</p>
                                  </div>
                                </div>
                            ))
                        )}
                      </div>

                      <div className="order-summary">
                        <h4>Order Summary</h4>
                        <div className="summary-row">
                          <span>Total Items:</span>
                          <span>{order.items.length}</span>
                        <div className="summary-row">
                          <span>Total Amount:</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                          <span>Payment Method:</span>
                          <span>
                      {order.paymentMethod
                          .replace("_", " ")
                          .toUpperCase()}
                    </span>
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
        )}
      </div>
      </main>
  );
}

export default Orders;
