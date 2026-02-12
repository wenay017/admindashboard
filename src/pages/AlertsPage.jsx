import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaExclamationTriangle,
  FaBell,
  FaSearch,
  FaEnvelope,
  FaSync,
  FaWater,
  FaMapMarkerAlt
} from "react-icons/fa";
import API from "../services/api";
import "../styles/AlertsPage.css";

const AlertsPage = () => {
  const [alertDevices, setAlertDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Use localStorage to persist sent alerts across page refreshes
  const getStoredAlerts = () => {
    try {
      const stored = localStorage.getItem('waterAlertSentTimestamps');
      return stored ? new Map(JSON.parse(stored)) : new Map();
    } catch (error) {
      console.error('Error reading stored alerts:', error);
      return new Map();
    }
  };

  const setStoredAlerts = (alertMap) => {
    try {
      // Clean old entries (older than 1 hour) before storing
      const now = Date.now();
      const cleanMap = new Map();
      for (let [key, value] of alertMap) {
        if (now - value < 3600000) { // Keep only entries from last hour
          cleanMap.set(key, value);
        }
      }
      localStorage.setItem('waterAlertSentTimestamps', JSON.stringify([...cleanMap]));
    } catch (error) {
      console.error('Error storing alerts:', error);
    }
  };

  // Use refs to track sent alerts and processed data
  const lastAlertSentRef = useRef(getStoredAlerts());
  const processedDataRef = useRef(new Map());
  const initialLoadRef = useRef(true);

  // Parse email list from data6
  const parseEmailList = (data6String) => {
    if (!data6String || typeof data6String !== 'string') return [];

    const emails = data6String
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(email => {
        const cleanEmail = email.replace(/\.com\.com$/, '.com');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(cleanEmail);
      })
      .map(email => email.replace(/\.com\.com$/, '.com'));

    return [...new Set(emails)];
  };

  // Send water level alert email
  const sendWaterAlertEmail = async (emails, deviceId, sensorData) => {
    if (!emails || emails.length === 0) {
      console.warn('No valid email addresses found for alert');
      return false;
    }

    try {
      const toArray = emails.map(email => ({
        email: email,
        name: email.split('@')[0]
      }));

      const payload = {
        sender: {
          name: "जल स्तर अलर्ट",
          email: "pinea.notify@gmail.com"
        },
        to: toArray,
        subject: `🚨 जल स्तर अलर्ट `,
        textContent: `सावधान:-\nडैम का जल स्तर बढ़ रहा है अतः सुरक्षित जगह सावधान और सुरक्षित रहे।`,
        htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: ltr;">
            <h2 style="color: #dc2626; text-align: center;">🚨 जल स्तर अलर्ट</h2>
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="font-size: 20px; line-height: 1.8; text-align: center;">
                    <strong>सावधान:-</strong><br>
                    डैम का जल स्तर बढ़ रहा है<br>
                    अतः सुरक्षित जगह सावधान और सुरक्षित रहे।
                </p>
            </div>
            <p style="color: #6b7280; text-align: center; font-size: 12px;">
                पाइनिया जल निगरानी प्रणाली से स्वचालित चेतावनी
            </p>
        </div>
    `
      };

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': '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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Water level alert email sent successfully:', result);

      // Record when we sent this alert in both ref and localStorage
      const sentTime = Date.now();
      lastAlertSentRef.current.set(deviceId, sentTime);
      setStoredAlerts(lastAlertSentRef.current);

      return true;
    } catch (error) {
      console.error('Error sending water level alert email:', error);
      return false;
    }
  };

  // Check if we should send an alert for this device
  const shouldSendAlert = (deviceId, latestData, isAutoRefresh = false) => {
    if (!latestData) return false;

    const lastAlertTime = lastAlertSentRef.current.get(deviceId);
    const dataTimestamp = new Date(latestData.createdAt).getTime();
    const now = Date.now();

    // Check if data is fresh (within 40 seconds)
    if (now - dataTimestamp > 40000) {
      console.log(`Alert for ${deviceId} skipped: Data is older than 40 seconds`);
      return false;
    }

    // Don't send alert if we sent one in the last 1 minute (60000 ms)
    if (lastAlertTime && (now - lastAlertTime < 60000)) {
      console.log(`Alert for ${deviceId} skipped: Sent recently (${Math.round((now - lastAlertTime) / 1000)}s ago)`);
      return false;
    }

    // Check if we've already processed this specific data (using data timestamp as key)
    const dataKey = `${deviceId}_${dataTimestamp}`;
    if (processedDataRef.current.has(dataKey)) {
      console.log(`Alert for ${deviceId} skipped: Data already processed`);
      return false;
    }

    // For initial load, don't send alerts for existing data
    if (isAutoRefresh && initialLoadRef.current) {
      console.log(`Alert for ${deviceId} skipped: Initial page load`);
      return false;
    }

    // Mark this specific data as processed
    processedDataRef.current.set(dataKey, true);
    return true;
  };

  // Fetch alert devices and their data
  const fetchAlertDevices = async (isAutoRefresh = false) => {
    try {
      if (!isAutoRefresh) {
        setLoading(true);
      }
      setError(null);

      console.log('Starting to fetch alert devices...');

      // Step 1: Get all devices from the API
      console.log('Fetching from /sensor-data/devices/all');
      const devicesResponse = await API.get('/sensor-data/devices/all');
      console.log('Devices API response:', devicesResponse);

      const allDevices = devicesResponse.data.devices || [];
      console.log('All devices loaded:', allDevices.length, allDevices);

      // Step 2: Filter devices that have "-alert" in their device_id
      const alertDevicesList = allDevices.filter(device => {
        const hasAlert = device.device_id && device.device_id.toLowerCase().includes('-alert');
        if (hasAlert) {
          console.log('Found alert device:', device.device_id, device);
        }
        return hasAlert;
      });

      console.log('Alert devices found:', alertDevicesList.length, alertDevicesList);

      if (alertDevicesList.length === 0) {
        console.log('No alert devices found in the response');
        setAlertDevices([]);
        return;
      }

      // Step 3: Fetch sensor data for each alert device
      const devicesWithData = await Promise.all(
        alertDevicesList.map(async (device) => {
          try {
            console.log(`Fetching data for device: ${device.device_id}`);

            // Fetch sensor data for this specific device
            const dataResponse = await API.get(`/sensor-data?device_id=${device.device_id}`);
            const deviceData = dataResponse.data.data || dataResponse.data || [];
            console.log(`Data for ${device.device_id}:`, deviceData.length, 'records', deviceData);

            // Get the latest entry (most recent createdAt)
            const latestData = deviceData.length > 0
              ? deviceData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
              : null;

            const emails = latestData?.data6 ? parseEmailList(latestData.data6) : [];

            console.log(`Device ${device.device_id}: ${emails.length} emails found`);

            // Auto-send water level alert only if conditions are met
            if (emails.length > 0 && latestData && shouldSendAlert(device.device_id, latestData, isAutoRefresh)) {
              console.log(`Sending alert for ${device.device_id} to ${emails.length} recipients`);
              try {
                const emailSent = await sendWaterAlertEmail(emails, device.device_id, latestData);
                if (emailSent) {
                  console.log(`Water level alert sent for device: ${device.device_id}`);
                } else {
                  console.log(`Failed to send alert for device: ${device.device_id}`);
                }
              } catch (emailError) {
                console.error(`Error sending email for ${device.device_id}:`, emailError);
              }
            } else if (emails.length > 0 && latestData) {
              console.log(`Alert conditions not met for ${device.device_id}:`, {
                hasEmails: emails.length > 0,
                hasData: !!latestData,
                shouldSend: shouldSendAlert(device.device_id, latestData, isAutoRefresh),
                dataAge: latestData ? `${Math.round((Date.now() - new Date(latestData.createdAt).getTime()) / 1000)}s` : 'N/A',
                lastAlert: lastAlertSentRef.current.get(device.device_id)
                  ? `${Math.round((Date.now() - lastAlertSentRef.current.get(device.device_id)) / 1000)}s ago`
                  : 'Never'
              });
            }

            return {
              id: device._id,
              device_id: device.device_id,
              device_name: device.device_name,
              device_location: device.device_location,
              device_site_name: device.device_site_name,
              latitude: device.latitude,
              longitude: device.longitude,
              message: latestData ? "Water Level Monitoring Active" : "No Data Available",
              severity: "High",
              latestData: latestData,
              createdAt: latestData ? new Date(latestData.createdAt) : new Date(),
              emails: emails,
              emailCount: emails.length,
              totalReadings: deviceData.length,
              status: latestData ? "active" : "inactive",
              lastAlertSent: lastAlertSentRef.current.get(device.device_id),
              dataAge: latestData ? Math.round((Date.now() - new Date(latestData.createdAt).getTime()) / 1000) : null
            };
          } catch (error) {
            console.error(`Error processing device ${device.device_id}:`, error);
            return {
              id: device._id,
              device_id: device.device_id,
              device_name: device.device_name,
              device_location: device.device_location,
              device_site_name: device.device_site_name,
              latitude: device.latitude,
              longitude: device.longitude,
              message: "Error fetching device data: " + error.message,
              severity: "Medium",
              latestData: null,
              createdAt: new Date(),
              emails: [],
              emailCount: 0,
              totalReadings: 0,
              status: "error",
              lastAlertSent: null,
              dataAge: null
            };
          }
        })
      );

      setAlertDevices(devicesWithData);
      console.log('Final alert devices with data:', devicesWithData);

    } catch (error) {
      console.error('Error fetching alert devices:', error);
      if (!isAutoRefresh) {
        setError(`Failed to load alert devices: ${error.message}`);
      }
    } finally {
      if (!isAutoRefresh) {
        setLoading(false);
      }
      setRefreshing(false);

      // Mark initial load as complete after first successful load
      if (initialLoadRef.current) {
        initialLoadRef.current = false;
        console.log('Initial load completed, future refreshes will send alerts for new data');
      }
    }
  };

  useEffect(() => {
    // Initial load
    fetchAlertDevices(false);

    // Auto-refresh every 10 seconds for new data
    const interval = setInterval(() => {
      console.log('Auto-refreshing alert devices...');
      fetchAlertDevices(true);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAlertDevices(false);
  };

  const handleSendTestAlert = async (device) => {
    if (!device.latestData || device.emails.length === 0) {
      alert('Water level alert');
      return;
    }

    try {
      const emailSent = await sendWaterAlertEmail(device.emails, device.device_id, device.latestData);
      if (emailSent) {
        alert('Water level alert');
      } else {
        alert('Water level alert');
      }
    } catch (error) {
      console.error('Error sending test alert:', error);
      alert('Water level alert');
    }
  };

  // Filter devices based on search
  const filteredDevices = alertDevices.filter(device =>
    device.device_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.device_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.device_site_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="alerts-container">
        <div className="loading-container">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p>Loading alert devices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="alerts-container">
      {/* Header */}
      <div className="alerts-header">
        <motion.div
          className="header-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-title">
            <FaBell className="header-icon" />
            <h1>Water Level Alerts</h1>
            <span className="device-count">{alertDevices.length} alert devices</span>
          </div>
          <p className="header-subtitle">
            Automatic water level alerts - Checking for new data every 10 seconds
          </p>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="alerts-controls">
        <motion.div
          className="search-container"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search alert devices by ID, location, or site..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </motion.div>

        <motion.button
          onClick={handleRefresh}
          disabled={refreshing}
          className="refresh-btn"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaSync className={refreshing ? 'spinning' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Now'}
        </motion.button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="error-message"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
          <div style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
            Check browser console for detailed error information
          </div>
        </motion.div>
      )}

      {/* Alerts Grid */}
      <div className="alerts-grid">
        {filteredDevices.length === 0 ? (
          <div className="no-devices">
            {searchTerm ? 'No alert devices match your search' : 'No alert devices found'}
            {alertDevices.length === 0 && !error && (
              <div style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.7 }}>
                No devices with "-alert" in their ID were found in the system.
              </div>
            )}
          </div>
        ) : (
          filteredDevices.map((device, index) => (
            <motion.div
              key={device.id}
              className="alert-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="card-header">
                <div className="device-title">
                  <FaWater className="water-icon" />
                  <div>
                    <h3>{device.device_id}</h3>
                    <span className="device-type">{device.device_name}</span>
                  </div>
                </div>
                <div className={`status-badge ${device.status}`}>
                  {device.status === 'active' ? 'Active' : device.status === 'inactive' ? 'No Data' : 'Error'}
                </div>
              </div>

              <div className="card-content">
                {/* Location Information */}
                {(device.device_location || device.device_site_name) && (
                  <div className="location-info">
                    <FaMapMarkerAlt className="location-icon" />
                    <div>
                      {device.device_location && <span>{device.device_location}</span>}
                      {device.device_site_name && <span> • {device.device_site_name}</span>}
                    </div>
                  </div>
                )}

                <div className="alert-message">
                  <FaExclamationTriangle className="alert-icon" />
                  <span>{device.message}</span>
                </div>

                <div className="device-info">
                  <div className="info-item">
                    <span className="label">Last Update:</span>
                    <span className="value">{device.createdAt.toLocaleString()}</span>
                  </div>

                  <div className="info-item">
                    <span className="label">Data Age:</span>
                    <span className="value">{device.dataAge !== null ? `${device.dataAge}s ago` : 'N/A'}</span>
                  </div>

                  <div className="info-item">
                    <span className="label">Total Readings:</span>
                    <span className="value">{device.totalReadings}</span>
                  </div>

                  {device.latestData && (
                    <>
                      <div className="info-item">
                        <span className="label">Flow Rate:</span>
                        <span className="value">{device.latestData.data2} m³/hr</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Cumulative Flow:</span>
                        <span className="value">{device.latestData.data3} m³</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="email-section">
                  <div className="email-header">
                    <FaEnvelope className="email-icon" />
                    <span>Alert Recipients: {device.emailCount}</span>
                  </div>
                  {device.emails.length > 0 && (
                    <div className="email-list">
                      {device.emails.map((email, index) => (
                        <span key={index} className="email-badge">
                          {email}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="test-alert-btn"
                  onClick={() => handleSendTestAlert(device)}
                  disabled={!device.latestData || device.emailCount === 0}
                >
                  <FaBell /> Send Test Alert
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPage;