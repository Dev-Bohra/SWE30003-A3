import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your store and users</p>
      </div>

      <div className="dashboard-grid">
        <Link to="/admin/products" className="dashboard-card">
          <div className="card-icon">📦</div>
          <h3>Manage Products</h3>
          <p>Add, edit, or remove products</p>
        </Link>

        <Link to="/admin/orders" className="dashboard-card">
          <div className="card-icon">📋</div>
          <h3>View Orders</h3>
          <p>Track and manage customer orders</p>
        </Link>

        <Link to="/admin/users" className="dashboard-card">
          <div className="card-icon">👥</div>
          <h3>Manage Users</h3>
          <p>View and manage user accounts</p>
        </Link>

        <Link to="/admin/analytics" className="dashboard-card">
          <div className="card-icon">📊</div>
          <h3>Analytics</h3>
          <p>View store statistics and insights</p>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard; 