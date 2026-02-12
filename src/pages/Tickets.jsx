import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaUndo, FaSearch, FaSort, FaTimes } from "react-icons/fa";
import "../styles/TicketManagement.css";

const BASE_URL = "http://13.201.156.32:5000/api";

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    description: "",
  });
  const [viewTicket, setViewTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "status",
    direction: "ascending",
  });
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const loadTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASE_URL}/tickets/all`);
      setTickets(res.data);
      setFilteredTickets(res.data);
    } catch (err) {
      setError("Failed to load tickets.");
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    let results = tickets;
    
    if (searchTerm) {
      results = results.filter(
        (ticket) =>
          ticket.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      results = results.filter(ticket => 
        ticket.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    setFilteredTickets(results);
  }, [searchTerm, tickets, statusFilter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "subject" && value.length > 24) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!formData.subject.trim() || !formData.description.trim()) {
      setError("Subject and Description are required");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/tickets/create`, formData);
      setFormData({ email: "", subject: "", description: "" });
      loadTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket.");
    }
  };

  const updateTicketStatus = async (ticketId, status) => {
    setError("");
    try {
      await axios.patch(`${BASE_URL}/tickets/status`, { ticketId, status });
      loadTickets();
      if (viewTicket && viewTicket._id === ticketId) {
        setViewTicket({
          ...viewTicket,
          status,
          resolvedAt: status === "done" ? new Date().toISOString() : viewTicket.resolvedAt,
        });
      }
    } catch (err) {
      setError("Failed to update ticket status.");
      console.error(err);
    }
  };

  const reopenTicket = async (ticketId) => {
    setError("");
    try {
      await axios.patch(`${BASE_URL}/tickets/status`, {
        ticketId,
        status: "open"
      });
      loadTickets();
      if (viewTicket && viewTicket._id === ticketId) {
        setViewTicket({
          ...viewTicket,
          status: "open",
          resolvedAt: null,
        });
      }
    } catch (err) {
      setError("Failed to reopen ticket.");
      console.error(err);
    }
  };

  const deleteTicket = async (ticketId) => {
    try {
      await axios.delete(`${BASE_URL}/tickets/delete`, {
        data: { ticketId },
      });
      loadTickets();
    } catch (err) {
      setError("Failed to delete ticket.");
      console.error(err);
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setShowStatusDropdown(false);
  };

  const sortedTickets = React.useMemo(() => {
    let sortableTickets = [...filteredTickets];
    if (sortConfig.key) {
      sortableTickets.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTickets;
  }, [filteredTickets, sortConfig]);

  return (
    <div className="ticket-management">
      <h2>Ticket Management</h2>

      <form className="ticket-form" onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="subject"
          placeholder="Subject (max 24 chars)"
          value={formData.subject}
          onChange={handleChange}
          maxLength={24}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <button type="submit">Create Ticket</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <div className="search-sort-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="sort-actions">
          <div className="status-filter-container">
            <button 
              className="status-filter-button"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <FaSort /> Filter by Status
            </button>
            {showStatusDropdown && (
              <div className="status-dropdown">
                <button onClick={() => handleStatusFilter("all")}>All Tickets</button>
                <button onClick={() => handleStatusFilter("open")}>Open</button>
                <button onClick={() => handleStatusFilter("in_progress")}>In Progress</button>
                <button onClick={() => handleStatusFilter("done")}>Done</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-animation">
          <div className="spinner"></div>
          <p>Loading tickets...</p>
        </div>
      ) : (
        <div className="ticket-list">
          <div className="table-tickt">
            <table>
              <thead>
                <tr>
                  <th>User Email</th>
                  <th>Subject</th>
                  <th>Description</th>
                  <th onClick={() => requestSort("status")}>
                    Status {sortConfig.key === "status" && 
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                  </th>
                  <th>Created</th>
                  <th>Resolved</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedTickets.map((ticket) => (
                  <tr key={ticket._id} className={`ticket-row status-${ticket.status}`}>
                    <td>{ticket.user?.email || "N/A"}</td>
                    <td>{ticket.subject}</td>
                    <td className="description-cell">{ticket.description}</td>
                    <td>{ticket.status}</td>
                    <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                    <td>{ticket.resolvedAt ? new Date(ticket.resolvedAt).toLocaleString() : "-"}</td>
                    <td>
                      <button 
                        className="view-btn"
                        onClick={() => setViewTicket(ticket)}
                      >
                        View
                      </button>
                      {ticket.status === "open" && (
                        <button 
                          className="action-btn accept-btn"
                          onClick={() => updateTicketStatus(ticket._id, "in_progress")}
                        >
                          Accept
                        </button>
                      )}
                      {ticket.status === "in_progress" && (
                        <button 
                          className="action-btn solve-btn"
                          onClick={() => updateTicketStatus(ticket._id, "done")}
                        >
                          Solve
                        </button>
                      )}
                      {ticket.status === "done" && (
                        <div className="done-actions">
                          <button 
                            className="action-btn reopen-btn"
                            onClick={() => reopenTicket(ticket._id)}
                          >
                            <FaUndo /> Reopen
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => deleteTicket(ticket._id)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewTicket && (
        <div className="ticket-popup">
          <div className="popup-content slide-in">
            <button className="close-popup" onClick={() => setViewTicket(null)}>
              <FaTimes />
            </button>
            <h3>Ticket Details</h3>
            <p><strong>User Email:</strong> {viewTicket.user?.email || "N/A"}</p>
            <p><strong>Subject:</strong> {viewTicket.subject}</p>
            <p><strong>Description:</strong> {viewTicket.description}</p>
            <p><strong>Status:</strong> {viewTicket.status}</p>
            <p><strong>Created At:</strong> {new Date(viewTicket.createdAt).toLocaleString()}</p>
            <p><strong>Resolved At:</strong> {viewTicket.resolvedAt ? new Date(viewTicket.resolvedAt).toLocaleString() : "-"}</p>

            <div className="popup-buttons">
              {viewTicket.status === "open" && (
                <button className="action-btn accept-btn" onClick={() => updateTicketStatus(viewTicket._id, "in_progress")}>Accept Ticket</button>
              )}

              {viewTicket.status === "in_progress" && (
                <button className="action-btn solve-btn" onClick={() => updateTicketStatus(viewTicket._id, "done")}>Solve Ticket</button>
              )}

              {viewTicket.status === "done" && (
                <button className="action-btn reopen-btn" onClick={() => reopenTicket(viewTicket._id)}>
                  <FaUndo /> Reopen Ticket
                </button>
              )}

              <button className="close-btn" onClick={() => setViewTicket(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketManagement;