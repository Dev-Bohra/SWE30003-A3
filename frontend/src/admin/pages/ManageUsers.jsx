import React, { useState } from 'react';
import '../styles/ManageUsers.css';

function ManageUsers() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Customer",
      status: "Active"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Admin",
      status: "Active"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "Customer",
      status: "Inactive"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "Customer",
      status: "Active"
    },
    {
      id: 5,
      name: "David Brown",
      email: "david@example.com",
      role: "Customer",
      status: "Active"
    },
    {
      id: 6,
      name: "Emily Davis",
      email: "emily@example.com",
      role: "Customer",
      status: "Inactive"
    },
    {
      id: 7,
      name: "Robert Taylor",
      email: "robert@example.com",
      role: "Customer",
      status: "Active"
    },
    {
      id: 8,
      name: "Lisa Anderson",
      email: "lisa@example.com",
      role: "Customer",
      status: "Active"
    }
  ]);

  const [supportTickets, setSupportTickets] = useState([
    {
      id: "TKT001",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      subject: "Order Issue",
      message: "My order #12345 has not been delivered yet",
      status: "Open",
      createdAt: "2024-03-15"
    },
    {
      id: "TKT002",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      subject: "Product Inquiry",
      message: "When will the iPhone 15 be back in stock?",
      status: "In Progress",
      createdAt: "2024-03-14"
    },
    {
      id: "TKT003",
      customerName: "Mike Johnson",
      customerEmail: "mike@example.com",
      subject: "Account Issue",
      message: "Cannot reset my password",
      status: "Resolved",
      createdAt: "2024-03-13"
    }
  ]);

  const [editingUser, setEditingUser] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleSave = (id) => {
    setUsers(users.map(user => 
      user.id === id ? editingUser : user
    ));
    setEditingUser(null);
  };

  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  // Support ticket functions
  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    setSupportTickets(tickets => 
      tickets.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: newStatus }
          : ticket
      )
    );
  };

  const getStatusBadgeClass = (status) => {
    switch(status.toLowerCase()) {
      case 'open': return 'status-open';
      case 'in progress': return 'status-progress';
      case 'resolved': return 'status-resolved';
      default: return '';
    }
  };

  return (
    <div className="analytics-container">
      {/* User Management Section */}
      <div className="section-container">
        <div className="analytics-header">
          <h1>User Management</h1>
          <p>Manage user accounts and permissions</p>
        </div>

        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    {editingUser?.id === user.id ? (
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td>
                    {editingUser?.id === user.id ? (
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td>
                    {editingUser?.id === user.id ? (
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                      >
                        <option value="Customer">Customer</option>
                        <option value="Admin">Admin</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td>
                    <select
                      className={`status-select ${user.status.toLowerCase()}`}
                      value={user.status}
                      onChange={(e) => handleStatusChange(user.id, e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </td>
                  <td>
                    {editingUser?.id === user.id ? (
                      <button onClick={() => handleSave(user.id)}>Save</button>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(user)}>Edit</button>
                        <button onClick={() => handleDelete(user.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Support Tickets Section */}
      <div className="section-container">
        <div className="analytics-header">
          <h1>Support Requests</h1>
          <p>Manage customer support tickets</p>
        </div>

        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Customer</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {supportTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>
                    <div>{ticket.customerName}</div>
                    <small>{ticket.customerEmail}</small>
                  </td>
                  <td>{ticket.subject}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td>{ticket.createdAt}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="view-btn"
                        onClick={() => handleViewTicket(ticket)}
                      >
                        View
                      </button>
                      <select
                        className="status-select"
                        value={ticket.status}
                        onChange={(e) => handleUpdateTicketStatus(ticket.id, e.target.value)}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details Modal */}
      {showTicketModal && selectedTicket && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Ticket Details</h2>
            <div className="ticket-details">
              <div className="detail-row">
                <strong>Ticket ID:</strong>
                <span>{selectedTicket.id}</span>
              </div>
              <div className="detail-row">
                <strong>Customer:</strong>
                <span>{selectedTicket.customerName}</span>
              </div>
              <div className="detail-row">
                <strong>Email:</strong>
                <span>{selectedTicket.customerEmail}</span>
              </div>
              <div className="detail-row">
                <strong>Subject:</strong>
                <span>{selectedTicket.subject}</span>
              </div>
              <div className="detail-row">
                <strong>Message:</strong>
                <p>{selectedTicket.message}</p>
              </div>
              <div className="detail-row">
                <strong>Status:</strong>
                <span className={`status-badge ${getStatusBadgeClass(selectedTicket.status)}`}>
                  {selectedTicket.status}
                </span>
              </div>
              <div className="detail-row">
                <strong>Created:</strong>
                <span>{selectedTicket.createdAt}</span>
              </div>
            </div>
            <div className="modal-buttons">
              <button 
                className="close-btn"
                onClick={() => setShowTicketModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers; 