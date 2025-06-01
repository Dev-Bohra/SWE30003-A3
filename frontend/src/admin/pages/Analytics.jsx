import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Analytics.css';
import '../styles/AdminDashboard.css';

function Analytics() {
  // Mock data for demonstration
  const metrics = {
    totalUsers: 1250,
    totalOrders: 856,
    totalRevenue: 45678.90,
    mostViewedProduct: "iPhone 13"
  };

  const ordersByCategory = {
    labels: ['Electronics', 'Accessories', 'Gadgets', 'Others'],
    data: [45, 25, 20, 10]
  };

  const userRoles = {
    labels: ['Customers', 'Admins'],
    data: [85, 15]
  };

  const recentActivity = [
    { id: 1, user: "john_doe", action: "Placed Order", time: "2 mins ago" },
    { id: 2, user: "admin_user", action: "Updated Product", time: "15 mins ago" },
    { id: 3, user: "jane_smith", action: "Created Account", time: "1 hour ago" },
    { id: 4, user: "admin_user", action: "Restocked Products", time: "2 hours ago" }
  ];

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <p>Key metrics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon" style={{ color: '#7c3aed' }}>👥</div>
          <div className="metric-info">
            <h3>Total Users</h3>
            <p className="metric-value">{metrics.totalUsers}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ color: '#059669' }}>📦</div>
          <div className="metric-info">
            <h3>Total Orders</h3>
            <p className="metric-value">{metrics.totalOrders}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ color: '#d97706' }}>💰</div>
          <div className="metric-info">
            <h3>Total Revenue</h3>
            <p className="metric-value">${metrics.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ color: '#dc2626' }}>👁️</div>
          <div className="metric-info">
            <h3>Most Viewed</h3>
            <p className="metric-value">{metrics.mostViewedProduct}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Orders by Category</h3>
          <div className="bar-chart">
            {ordersByCategory.labels.map((label, index) => (
              <div key={label} className="bar-container">
                <div className="bar-label">{label}</div>
                <div className="bar" style={{ 
                  height: `${ordersByCategory.data[index]}%`,
                  background: `linear-gradient(to top, ${getBarColor(index)}, ${getBarColor(index, true)})`
                }}>
                  <span className="bar-value">{ordersByCategory.data[index]}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>User Roles Breakdown</h3>
          <div className="pie-chart">
            <div className="pie-segment" style={{ '--color': '#7c3aed' }}>
              <span className="segment-label">Admin</span>
              <span className="segment-value">2</span>
            </div>
            <div className="pie-segment" style={{ '--color': '#059669' }}>
              <span className="segment-label">Customer</span>
              <span className="segment-value">8</span>
            </div>
            <div className="pie-segment" style={{ '--color': '#d97706' }}>
              <span className="segment-label">Guest</span>
              <span className="segment-value">5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="activity-card">
        <h3>Recent Activity</h3>
        <table className="activity-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map(activity => (
              <tr key={activity.id}>
                <td>{activity.user}</td>
                <td>{activity.action}</td>
                <td>{activity.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper function to get bar colors
function getBarColor(index, isLight = false) {
  const colors = [
    ['#7c3aed', '#a78bfa'], // Purple
    ['#059669', '#34d399'], // Green
    ['#d97706', '#fbbf24'], // Amber
    ['#dc2626', '#f87171']  // Red
  ];
  return colors[index % colors.length][isLight ? 1 : 0];
}

export default Analytics; 