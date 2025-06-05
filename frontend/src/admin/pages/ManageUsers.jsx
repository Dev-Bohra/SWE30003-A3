import React, { useState, useEffect } from 'react';
import '../styles/ManageUsers.css';
import {
  fetchAllUsers,
  fetchAllSupportTickets,
  updateSupportTicketStatus, updateCustomerInfo , deleteCustomer
} from '../api/adminUsersApi';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  useEffect(() => {
    fetchAllUsers()
        .then(setUsers)
        .catch(err => console.error("Failed to load users", err));

    fetchAllSupportTickets()
        .then(setSupportTickets)
        .catch(err => console.error("Failed to load support tickets", err));
  }, []);

  const handleEdit = (user) => {
    setEditingUser({
      ...user,
      name: `${user.firstName} ${user.lastName}`.trim()
    });
  };

  const handleSave = async (id) => {
    const [firstName, ...rest] = editingUser.name.trim().split(/\s+/);
    const lastName = rest.join(' ') || ' ';

    const updated = {
      ...editingUser,
      firstName,
      lastName
    };

    try {
      await updateCustomerInfo(id, {
        firstName,
        lastName,
        email: updated.email
      });

      setUsers(users.map(user =>
          user.id === id
              ? { ...user, firstName, lastName, email: updated.email }
              : user
      ));
      setEditingUser(null);
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Update failed. Please try again.");
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteCustomer(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Deletion failed. Please try again.");
    }
  };


  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      await updateSupportTicketStatus(ticketId, newStatus);
      setSupportTickets(tickets =>
          tickets.map(ticket =>
              ticket.ticketId === ticketId
                  ? { ...ticket, status: newStatus }
                  : ticket
          )
      );
    } catch (err) {
      console.error("Failed to update ticket status:", err);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
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
                              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                          />
                      ) : (
                          `${user.firstName} ${user.lastName}`
                      )}
                    </td>
                    <td>
                      {editingUser?.id === user.id ? (
                          <input
                              type="email"
                              value={editingUser.email}
                              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                          />
                      ) : (
                          user.email
                      )}
                    </td>
                    <td>
                      { (
                          user.role
                      )}
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
                  <tr key={ticket.ticketId}>
                    <td>{ticket.ticketId}</td>
                    <td>
                      <div>{ticket.customerName ?? "Unknown"}</div>
                      <small>{ticket.customerEmail ?? "n/a"}</small>
                    </td>
                    <td>{ticket.subject}</td>
                    <td>
                    <span className={`status-badge ${getStatusBadgeClass(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    </td>
                    <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
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
                            onChange={(e) => handleUpdateTicketStatus(ticket.ticketId, e.target.value)}
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
                    <span>{selectedTicket.ticketId}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Customer:</strong>
                    <span>{selectedTicket.customerName ?? "Unknown"}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Email:</strong>
                    <span>{selectedTicket.customerEmail ?? "n/a"}</span>
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
                    <span>{new Date(selectedTicket.createdAt).toLocaleString()}</span>
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
