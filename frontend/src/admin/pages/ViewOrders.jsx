// src/pages/ViewOrders.jsx
import React, { useState, useEffect } from 'react';
import { fetchAllOrders, updateOrderStatus } from '../api/adminOrdersApi';
import '../styles/ViewOrders.css';
import '../styles/AdminDashboard.css';

function ViewOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllOrders()
            .then((data) => {
                const rawOrders = Array.isArray(data.orders) ? data.orders : [];
                const parsed = rawOrders.map((order) => ({
                    ...order,
                    date:
                        order.createdAt && !isNaN(new Date(order.createdAt))
                            ? new Date(order.createdAt)
                            : null
                }));
                setOrders(parsed);
            })
            .catch((err) => {
                console.error('Failed to fetch orders:', err);
                setOrders([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleStatusChange = (orderId, newStatus) => {
        const updatedOrders = orders.map((order) => {
            if (order.orderId === orderId) {
                return { ...order, status: newStatus };
            }
            return order;
        });
        setOrders(updatedOrders);
        updateOrderStatus(orderId, newStatus).catch((err) => {
            console.error('Failed to update order status:', err);
        });
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
                    {loading ? (
                        <tr>
                            <td colSpan="6">Loading orders...</td>
                        </tr>
                    ) : orders.length === 0 ? (
                        <tr>
                            <td colSpan="6">No orders available.</td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.orderId}>
                                <td>{order.orderId}</td>
                                <td>{order.customerId}</td>
                                <td>${order.total?.toFixed(2)}</td>
                                <td>
                    <span className={`status-badge ${order.status?.toLowerCase()}`}>
                      {order.status}
                    </span>
                                </td>
                                <td>{order.date ? order.date.toLocaleDateString() : 'Unknown'}</td>
                                <td>
                                    <select
                                        className="status-select"
                                        value={order.status.toLowerCase()}
                                        onChange={(e) =>
                                            handleStatusChange(order.orderId, e.target.value)
                                        }
                                    >
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="paid">Paid</option>
                                        <option value="in transit">In Transit</option>
                                    </select>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ViewOrders;

