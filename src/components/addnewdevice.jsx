import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { FaPlus, FaSave } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AddDeviceForm = ({ onDeviceAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    device_id: "",
    device_name: "",
    device_location: "",
    device_site_name: "",
    latitude: "",
    longitude: "",
  });

  const deviceTypes = {
    "flow-meter": "Flow Meter",
    "pressure-sensor": "Pressure Sensor",
    Piezometer: "Piezometer",
    "water-quality": "Water Quality Sensor",
    "Flow-Sensor": "AWDBS",
    others: "Other Device",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!formData.device_id.trim()) {
      setError("Please enter a Device ID.");
      return;
    }
    if (!formData.device_name) {
      setError("Please select a Device Type.");
      return;
    }

    setError("");
    setIsAdding(true);

    try {
      // Step 1: Create the device record first
      await API.post("/devices", {
        device_id: formData.device_id,
        device_name: formData.device_name,
        device_location: formData.device_location || "",
        device_site_name: formData.device_site_name || "",
        latitude: formData.latitude || "",
        longitude: formData.longitude || "",
      });

      // Step 2: Create initial sensor data record
      await API.post("/sensor-data", {
        device_id: formData.device_id,
        device_name: formData.device_name,
        data1: 0,
        data2: 0,
        data3: 0,
        data4: 0,
        data5: 0,
        data6: 0,
        interval: 5,
      });

      toast.success("Device added successfully ✅");
      onDeviceAdded();
      
      setFormData({
        device_id: "",
        device_name: "",
        device_location: "",
        device_site_name: "",
        latitude: "",
        longitude: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error("Error adding device:", err);
      setError(
        err.response?.data?.message || "Failed to add device. Please try again.",
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div className="add-device-form-wrapper">
      <button
        onClick={() => setShowForm(!showForm)}
        className="add-device-toggle-btn"
      >
        <FaPlus /> {showForm ? "Hide Form" : "Add New Device"}
      </button>

      <AnimatePresence>
        {showForm && (
          <motion.div
            className="add-device-form-container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4>Add New Device</h4>
            
            {error && <div className="error-msg">{error}</div>}

            <div className="form-group">
              <label>Device ID:</label>
              <input
                type="text"
                name="device_id"
                value={formData.device_id}
                onChange={handleInputChange}
                placeholder="Enter device ID"
              />
            </div>

            <div className="form-group">
              <label>Device Type:</label>
              <select
                name="device_name"
                value={formData.device_name}
                onChange={handleInputChange}
              >
                <option value="">Select Device Type</option>
                {Object.entries(deviceTypes).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                name="device_location"
                value={formData.device_location}
                onChange={handleInputChange}
                placeholder="Enter location"
              />
            </div>

            <div className="form-group">
              <label>Site Name:</label>
              <input
                type="text"
                name="device_site_name"
                value={formData.device_site_name}
                onChange={handleInputChange}
                placeholder="Enter site name"
              />
            </div>

            <div className="form-group">
              <label>Latitude:</label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="e.g., 13.0827"
              />
            </div>

            <div className="form-group">
              <label>Longitude:</label>
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="e.g., 80.2707"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isAdding || !formData.device_id.trim() || !formData.device_name}
              className="submit-btn"
            >
              <FaSave /> {isAdding ? "Adding..." : "Add Device"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AddDeviceForm;