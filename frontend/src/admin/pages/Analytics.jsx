// src/pages/Analytics.jsx
import React, { useEffect, useState } from "react";
import "../styles/Analytics.css";
import { fetchAnalyticsApi } from "../api/adminAnalyticsApi";

function Analytics() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsApi()
        .then(setMetrics)
        .catch((err) => {
          console.error("Analytics error:", err);
          setError("Failed to load analytics");
        });
  }, []);

  if (error) return <div className="analytics-container"><p>{error}</p></div>;
  if (!metrics) return <div className="analytics-container"><p>Loading...</p></div>;

  const { totalUsers, totalOrders, totalRevenue, mostViewedProduct, ordersByCategory, userRoles } = metrics;

  return (
      <div className="analytics-container">
        <div className="analytics-header">
          <h1>Analytics Dashboard</h1>
          <p>Key metrics and insights</p>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <MetricCard icon="👥" color="#7c3aed" title="Total Users" value={totalUsers} />
          <MetricCard icon="📦" color="#059669" title="Total Orders" value={totalOrders} />
          <MetricCard icon="💰" color="#d97706" title="Total Revenue" value={`$${Number(totalRevenue).toFixed(2)}`} />
          <MetricCard icon="👁️" color="#dc2626" title="Most Viewed" value={mostViewedProduct} />
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Orders by Category</h3>
            <div className="bar-chart">
              {Object.entries(ordersByCategory).map(([label, value], index) => (
                  <div key={label} className="bar-container">
                    <div className="bar-label">{label}</div>
                    <div className="bar" style={{
                      height: `${value}%`,
                      background: `linear-gradient(to top, ${getBarColor(index)}, ${getBarColor(index, true)})`
                    }}>
                      <span className="bar-value">{value}</span>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <h3>User Roles Breakdown</h3>
            <div className="pie-chart">
              {Object.entries(userRoles).map(([role, count], index) => (
                  <div className="pie-segment" key={role} style={{ "--color": getBarColor(index) }}>
                    <span className="segment-label">{role}</span>
                    <span className="segment-value">{count}</span>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}

function MetricCard({ icon, color, title, value }) {
  return (
      <div className="metric-card">
        <div className="metric-icon" style={{ color }}>{icon}</div>
        <div className="metric-info">
          <h3>{title}</h3>
          <p className="metric-value">{value}</p>
        </div>
      </div>
  );
}

function getBarColor(index, isLight = false) {
  const colors = [
    ['#7c3aed', '#a78bfa'],
    ['#059669', '#34d399'],
    ['#d97706', '#fbbf24'],
    ['#dc2626', '#f87171']
  ];
  return colors[index % colors.length][isLight ? 1 : 0];
}

export default Analytics;
