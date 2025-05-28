import React, { useState } from 'react';
import '../styles/Orders.css';

// Mock data for orders
const mockOrders = [
  {
    orderId: 'ORD001',
    date: '2024-05-15T10:00:00Z', // Using ISO format
    total: 199.99,
    status: 'Shipped',
    items: [
      { name: 'Wireless Earbuds', quantity: 1, price: 99.99 },
      { name: 'Phone Case', quantity: 2, price: 100.00 }
    ],
    shippingAddress: '123 Main St, City, Country',
    paymentMethod: 'Credit Card'
  },
  {
    orderId: 'ORD002',
    date: '2024-05-10T12:30:00Z', // Using ISO format
    total: 349.49,
    status: 'Delivered',
    items: [
      { name: 'Smart Watch', quantity: 1, price: 349.49 }
    ],
    shippingAddress: '456 Park Ave, City, Country',
    paymentMethod: 'PayPal'
  },
  {
    orderId: 'ORD003',
    date: '2024-04-28T08:00:00Z', // Using ISO format
    total: 89.0,
    status: 'Pending',
    items: [
      { name: 'Laptop Stand', quantity: 1, price: 89.0 }
    ],
    shippingAddress: '789 Oak St, City, Country',
    paymentMethod: 'Debit Card'
  }
];

function Orders() {
  const [selectedOrder, setSelectedOrder] = useState(null); // State to manage the selected order for the modal
  const [statusFilter, setStatusFilter] = useState('all'); // State for status filter
  const [sortBy, setSortBy] = useState('date'); // State for sorting by date or total
  const [sortOrder, setSortOrder] = useState('desc'); // State for sort order (asc or desc)
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  // Function to get simple status class based on status
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'shipped':
        return 'status-shipped';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  };

  // Filter orders by status and search term
  const filteredOrders = mockOrders.filter(order => {
    const statusMatch = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    const searchTermMatch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return statusMatch && searchTermMatch;
  });

  // Sort filtered orders
  const filteredAndSortedOrders = filteredOrders.sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    } else if (sortBy === 'total') {
      return sortOrder === 'desc' ? b.total - a.total : a.total - b.total;
    }
    return 0;
  });

  return (
    <div className="container py-4">
      <h2 className="mb-4">My Orders</h2>

      {/* Filter, Sort, and Search Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
         {/* Search Input */}
        <input 
          type="text" 
          className="form-control w-auto mb-2 mb-md-0" /* Added w-auto and responsive margins */
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Right-aligned controls container */}
        <div className="d-flex gap-3 flex-wrap">
          {/* Status Filter */}
          <select 
            className="form-select w-auto order-select-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>

          {/* Sort By */}
          <select 
            className="form-select w-auto order-select-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="total">Sort by Amount</option>
          </select>

          {/* Sort Order Toggle */}
          <button 
            className="btn btn-outline-secondary" 
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          >
            <i className={`bi bi-sort-${sortOrder === 'desc' ? 'down' : 'up'}`}></i> {/* Using Bootstrap Icons for sort direction */}
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Items</th>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedOrders.map((order) => (
              <tr key={order.orderId}>
                <td>
                  <ul className="list-unstyled mb-0">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.quantity}x {item.name}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{order.orderId}</td>
                <td>{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <span className={getStatusClass(order.status)}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedOrders.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <p className="mt-3 text-muted">No orders found</p>
        </div>
      )}

      {selectedOrder && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Receipt for Order - {selectedOrder.orderId}</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <h6>Order Information</h6>
                  <p className="mb-1"><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                  <p className="mb-1"><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="mb-1"><strong>Status:</strong> <span className={getStatusClass(selectedOrder.status)}>{selectedOrder.status}</span></p>
                  <p className="mb-1"><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                  <p className="mb-1"><strong>Shipping Address:</strong> {selectedOrder.shippingAddress}</p>
                </div>
                <div className="mb-3">
                  <h6>Items</h6>
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>${(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                        <td><strong>${selectedOrder.total.toFixed(2)}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {selectedOrder && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default Orders;
