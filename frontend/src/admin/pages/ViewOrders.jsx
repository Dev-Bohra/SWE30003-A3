import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ViewOrders.css';
import '../styles/AdminDashboard.css';

function ViewOrders() {
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      user: "John Doe",
      total: "150.00",
      status: "Pending",
      date: "2024-03-15"
    },
    {
      id: "ORD002",
      user: "Jane Smith",
      total: "75.50",
      status: "Shipped",
      date: "2024-03-14"
    },
    {
      id: "ORD003",
      user: "Mike Johnson",
      total: "200.00",
      status: "Delivered",
      date: "2024-03-13"
    },
    {
      id: "ORD004",
      user: "Sarah Wilson",
      total: "125.75",
      status: "Pending",
      date: "2024-03-12"
    },
    {
      id: "ORD005",
      user: "David Brown",
      total: "300.25",
      status: "Shipped",
      date: "2024-03-11"
    }
  ]);

  // Update order status
  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    
    setOrders(updatedOrders);
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Order Management</h1>
        <p>View and manage all orders</p>
      </div>
      
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user}</td>
                <td>${order.total}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.date}</td>
                <td>
                  <select 
                    className="status-select"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewOrders; 