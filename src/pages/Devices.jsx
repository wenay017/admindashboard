import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import "../styles/Devices.css";
import { motion } from "framer-motion";
import AddDeviceForm from "../components/addnewdevice";
import { FaEye } from "react-icons/fa";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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

  return (
    <div className="devices-container" ref={containerRef}>
      <AddDeviceForm onDeviceAdded={fetchDevices} />

      <motion.div className="devices-content">
        <h2 className="devices-title">Flow Meter Devices</h2>

        {/* 🔍 SEARCH BAR */}
        <div style={{ marginBottom: "20px", textAlign: "right" }}>
          <input
            type="text"
            placeholder="Search by ID, Name, Location..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: "8px 12px",
              width: "250px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
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
                  </tr>
                </thead>
                <tbody>
                  {currentPageDevices.map((device) => (
                    <tr key={device._id} className="device-row">
                      {tableHeaders.map((col) => (
                        <td key={col} className="devices-table-cell">
                          {col === "device_id" ? (
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

            {/* PAGINATION ARROWS */}
            <div className="devices-pagination">
              <button
                className="devices-btn-pagination"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              <span className="devices-page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="devices-btn-pagination"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};


export default Devices;
