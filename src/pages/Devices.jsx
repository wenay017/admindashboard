import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import "../styles/Devices.css";
import { motion, AnimatePresence } from "framer-motion";
import AddDeviceForm from "../components/addnewdevice";
import { FaEye, FaChevronLeft, FaChevronRight, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDeviceId, setEditingDeviceId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    device_id: "",
    device_name: "",
    device_location: "",
    device_site_name: "",
    latitude: "",
    longitude: "",
  });
  const itemsPerPage = 20;
  const containerRef = useRef(null);

  const columnMapping = {
    device_id: "Device ID",
    device_name: "Device Name",
    device_location: "Location",
    device_site_name: "Site Name",
    latitude: "Latitude",
    longitude: "Longitude",
    Usercount: "User Count"
  };

  // FETCH DEVICES + USERS
  const fetchDevices = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await API.get("/sensor-data/devices/all");
      const userRes = await API.get("/users");

      const usersData =
        userRes.data.data ||
        userRes.data.users ||
        userRes.data ||
        [];

      const devicesData = response.data.devices || [];

      const formattedDevices = devicesData.map((device) => {
        const usersForDevice = usersData.filter((user) =>
          user.devices?.some(
            (d) => d.device_id === device.device_id
          )
        );

        return {
          device_id: device.device_id || "N/A",
          device_name: device.device_name || "N/A",
          device_location: device.device_location || "N/A",
          device_site_name: device.device_site_name || "N/A",
          latitude:
            device.latitude === "NA" || !device.latitude
              ? "N/A"
              : device.latitude,
          longitude:
            device.longitude === "NA" || !device.longitude
              ? "N/A"
              : device.longitude,
          Usercount: usersForDevice.length,
          _id: device._id,
          assignedUsers: usersForDevice
        };
      });

      setDevices(formattedDevices);
    } catch (err) {
      console.error("Error loading devices:", err);
      setError("Failed to load devices.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // SEARCH FILTER
  const filteredDevices = devices.filter(
    (device) =>
      device.device_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.device_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.device_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.device_site_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageDevices = filteredDevices.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const tableHeaders = [
    "device_id",
    "device_name",
    "device_location",
    "device_site_name",
    "latitude",
    "longitude",
    "Usercount"
  ];

  const formatCoordinate = (coord) => {
    if (!coord || coord === "N/A") return "N/A";
    return coord.toString().trim();
  };

  // EDIT HANDLERS
  const handleEditClick = (device) => {
    setEditingDeviceId(device._id);
    setEditFormData({
      device_id: device.device_id,
      device_name: device.device_name,
      device_location: device.device_location,
      device_site_name: device.device_site_name,
      latitude: device.latitude,
      longitude: device.longitude,
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDeviceEdit = async () => {
    try {
      // Validate required fields (but NOT device_id - it can't be changed)
      if (!editFormData.device_name.trim()) {
        toast.error("Please select a Device Type.");
        return;
      }

      // Prepare payload - ONLY update these fields (NOT device_id)
      const updatePayload = {
        device_name: editFormData.device_name.trim(),
        device_location: editFormData.device_location?.trim() || "",
        device_site_name: editFormData.device_site_name?.trim() || "",
        latitude: editFormData.latitude ? parseFloat(editFormData.latitude) : "",
        longitude: editFormData.longitude ? parseFloat(editFormData.longitude) : "",
      };

      // Use device_id from the original device (NOT from editFormData)
      const deviceId = devices.find(d => d._id === editingDeviceId)?.device_id;

      if (!deviceId) {
        toast.error("Device ID not found");
        return;
      }

      console.log("📤 Sending PUT request to /devices/" + deviceId);
      console.log("📦 Payload (device_id NOT included):", updatePayload);

      // Call the updateDevice endpoint with device_id in URL
      const response = await API.put(`/devices/${deviceId}`, updatePayload);

      console.log("✅ Response:", response.data);

      if (response.data?.success || response.status === 200) {
        toast.success("Device updated successfully ✅");

        // Update local state with new data
        setDevices((prev) =>
          prev.map((device) =>
            device._id === editingDeviceId
              ? {
                  ...device,
                  device_name: editFormData.device_name,
                  device_location: editFormData.device_location,
                  device_site_name: editFormData.device_site_name,
                  latitude: editFormData.latitude,
                  longitude: editFormData.longitude,
                  // device_id STAYS THE SAME - not updated
                }
              : device
          )
        );
        setEditingDeviceId(null);
        setError(null);
      } else {
        const errorMsg = response.data?.message || "Failed to update device";
        toast.error(errorMsg);
        setError(errorMsg);
      }
    } catch (error) {
      console.error("❌ Error updating device:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Server error updating device. Please try again.";
      
      console.error("Error details:", {
        status: error.response?.status,
        message: errorMsg,
        data: error.response?.data
      });

      toast.error(errorMsg);
      setError(errorMsg);
    }
  };

  const handleCancelEdit = () => {
    setEditingDeviceId(null);
    setEditFormData({
      device_id: "",
      device_name: "",
      device_location: "",
      device_site_name: "",
      latitude: "",
      longitude: "",
    });
    setError(null);
  };

  return (
    <div className="devices-container" ref={containerRef}>
      <AddDeviceForm onDeviceAdded={fetchDevices} />

      <motion.div className="devices-content">
        <h2 className="devices-title">Flow Meter Devices</h2>

        {/* SEARCH BAR */}
        <div className="devices-search-wrapper">
          <input
            type="text"
            placeholder="Search by ID, Name, Location..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="devices-search-input"
          />
        </div>

        {isLoading ? (
          <p>Loading devices...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <div className="devices-table-wrapper">
              <table className="devices-table">
                <thead>
                  <tr>
                    {tableHeaders.map((header) => (
                      <th key={header} className="devices-table-header">
                        {columnMapping[header]}
                      </th>
                    ))}
                    <th className="devices-table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageDevices.map((device) => (
                    <tr key={device._id} className="device-row">
                      {tableHeaders.map((col) => (
                        <td key={col} className="devices-table-cell">
                          {editingDeviceId === device._id ? (
                            // EDIT MODE - Only specific fields editable
                            <div className="edit-cell-container">
                              {col === "device_id" ? (
                                // Device ID is READ-ONLY in edit mode
                                <span className="device-info-text">{device[col]}</span>
                              ) : col === "device_name" ? (
                                <select
                                  name={col}
                                  value={editFormData[col] || ""}
                                  onChange={handleEditInputChange}
                                  className="edit-input-field"
                                >
                                  <option value="">Select Device Type</option>
                                  <option value="flow-meter">Flow Meter</option>
                                  <option value="pressure-sensor">Pressure Sensor</option>
                                  <option value="Piezometer">Piezometer</option>
                                  <option value="water-quality">Water Quality Sensor</option>
                                  <option value="Flow-Sensor">AWDBS</option>
                                  <option value="others">Other Device</option>
                                </select>
                              ) : col === "latitude" || col === "longitude" ? (
                                <input
                                  type="number"
                                  name={col}
                                  value={editFormData[col] || ""}
                                  onChange={handleEditInputChange}
                                  className="edit-input-field"
                                  placeholder={`Enter ${col}`}
                                  step="0.000001"
                                />
                              ) : col === "device_location" || col === "device_site_name" ? (
                                <input
                                  type="text"
                                  name={col}
                                  value={editFormData[col] || ""}
                                  onChange={handleEditInputChange}
                                  className="edit-input-field"
                                  placeholder={`Enter ${col}`}
                                />
                              ) : (
                                // Other columns are read-only
                                <span className="device-info-text">{device[col]}</span>
                              )}
                            </div>
                          ) : col === "device_id" ? (
                            // VIEW MODE
                            <Link
                              to={`/device/${device[col]}`}
                              className="devices-device-link"
                            >
                              <span className="device-id-badge">
                                {device[col]}
                              </span>
                            </Link>
                          ) : col === "latitude" || col === "longitude" ? (
                            <span className="coordinate-value">
                              {formatCoordinate(device[col])}
                            </span>
                          ) : col === "Usercount" ? (
                            <span className="device-info-text">
                              {device[col]}
                              {device[col] > 0 && (
                                <FaEye
                                  style={{
                                    marginLeft: "8px",
                                    cursor: "pointer"
                                  }}
                                  onClick={() =>
                                    setSelectedUsers(device.assignedUsers)
                                  }
                                />
                              )}
                            </span>
                          ) : (
                            <span className="device-info-text">
                              {device[col]}
                            </span>
                          )}
                        </td>
                      ))}
                      {/* ACTIONS COLUMN */}
                      <td className="devices-table-cell edit-actions">
                        {editingDeviceId === device._id ? (
                          <>
                            <button
                              onClick={handleSaveDeviceEdit}
                              className="save-edit-btn"
                              title="Save"
                            >
                              <FaSave />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="cancel-edit-btn"
                              title="Cancel"
                            >
                              <FaTimes />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEditClick(device)}
                            className="edit-icon-btn"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* USER MODAL */}
            {selectedUsers && (
              <div className="device-modal-overlay">
                <div className="device-modal">
                  <h3>Assigned Users</h3>

                  {selectedUsers.length === 0 ? (
                    <p>No users assigned</p>
                  ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {selectedUsers.map((user) => (
                        <li key={user._id} style={{ marginBottom: "10px" }}>
                          <strong>{user.client_name}</strong>
                          <br />
                          Email: {user.email}
                          <br />
                          Mobile: {user.mobile_no}
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    className="devices-btn-pagination"
                    onClick={() => setSelectedUsers(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* PAGINATION SECTION */}
            {totalPages > 1 && (
              <div className="devices-pagination">
                <button
                  className="devices-btn-pagination devices-btn-prev"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  title="Previous Page"
                >
                  <FaChevronLeft /> Previous
                </button>

                <div className="devices-page-info">
                  <span className="current-page">{currentPage}</span>
                  <span className="page-separator">of</span>
                  <span className="total-pages">{totalPages}</span>
                </div>

                <button
                  className="devices-btn-pagination devices-btn-next"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  title="Next Page"
                >
                  Next <FaChevronRight />
                </button>
              </div>
            )}

            {/* RESULTS INFO */}
            <div className="devices-results-info">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDevices.length)} of {filteredDevices.length} devices
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Devices;
