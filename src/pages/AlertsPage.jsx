// // export default AlertsPage;
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   FaExclamationTriangle,
//   FaSearch,
//   FaSync,
//   FaTrash,
//   FaTachometerAlt,
//   FaCheck,
//   FaTimes
// } from "react-icons/fa";
// import API from "../services/api";
// import "../styles/AlertsPage.css";

// const AlertsPage = () => {
//   const [devicesWithGarbage, setDevicesWithGarbage] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [expandedDevice, setExpandedDevice] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [scanProgress, setScanProgress] = useState({ current: 0, total: 0 });
//   const [deletingId, setDeletingId] = useState(null);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);

//   // Check if device should be excluded (ends with _10 or matches pattern)
//   const shouldExcludeDevice = (deviceId) => {
//     if (!deviceId) return true;
    
//     const idStr = String(deviceId);
    
//     // Exclude if device ID ends with _10
//     if (idStr.endsWith('_10')) {
//       console.log(`Excluding device ${deviceId}: ends with _10`);
//       return true;
//     }
    
//     return false;
//   };

//   // Check if device is specifically "flow-meter"
//   const isFlowMeter = (device) => {
//     const deviceType = (device.device_type || device.type || "").toLowerCase();
//     const deviceName = (device.device_name || device.name || "").toLowerCase();
//     const deviceId = (device.device_id || device.id || "").toLowerCase();
    
//     // Only include devices with type "flow-meter"
//     return deviceType === 'flow-meter' || 
//            deviceType.includes('flow-meter') ||
//            deviceName === 'flow-meter' ||
//            deviceName.includes('flow-meter');
//   };

//   // Thorough check for CRITICAL Total Cumulative Flow (data3) drops
//   const detectCriticalCumulativeFlowDrop = (sensorData) => {
//     if (!sensorData || sensorData.length < 2) return [];
    
//     // Sort by timestamp
//     const sortedData = [...sensorData].sort((a, b) => 
//       new Date(a.createdAt) - new Date(b.createdAt)
//     );
    
//     const garbageRecords = [];
//     let lastGoodValue = null;
//     let lastGoodRecord = null;
    
//     for (let i = 0; i < sortedData.length; i++) {
//       const current = sortedData[i];
      
//       if (current.data3 === undefined) continue;
      
//       if (lastGoodValue === null) {
//         lastGoodValue = current.data3;
//         lastGoodRecord = current;
//         continue;
//       }
      
//       // Skip exact 0 values (device offline)
//       if (current.data3 === 0) {
//         console.log(`Device offline at ${current.createdAt}: value 0, ignoring`);
//         continue;
//       }
      
//       // Check if current value is LESS than last good value (DROP = GARBAGE)
//       if (current.data3 < lastGoodValue) {
//         const dropAmount = (lastGoodValue - current.data3).toFixed(3);
//         const dropPercentage = ((lastGoodValue - current.data3) / lastGoodValue) * 100;
        
//         // IGNORE if the dropped value is greater than 10
//         if (current.data3 > 10) {
//           console.log(`Skipping: dropped value ${current.data3} is > 10, not garbage`);
//           // Still update lastGoodValue if the value is reasonable
//           if (current.data3 >= lastGoodValue * 0.8) {
//             lastGoodValue = current.data3;
//             lastGoodRecord = current;
//           }
//           continue;
//         }
        
//         if (dropPercentage > 80) {
//           garbageRecords.push({
//             ...current,
//             _id: current._id,
//             garbageType: "CRITICAL Flow Drop",
//             previousValue: lastGoodValue,
//             currentValue: current.data3,
//             dropAmount: dropAmount,
//             dropPercentage: dropPercentage.toFixed(2),
//             previousRecord: lastGoodRecord,
//             timestamp: current.createdAt,
//             severity: "Critical"
//           });
//         }
//       } else {
//         if (current.data3 >= lastGoodValue) {
//           lastGoodValue = current.data3;
//           lastGoodRecord = current;
//         }
//       }
//     }
    
//     return garbageRecords;
//   };

//   // Handle single delete with verification
//   const handleDelete = async (record, deviceId) => {
//     // Show verification dialog
//     const userConfirmed = window.confirm(
//       `⚠️ VERIFY BEFORE DELETING ⚠️\n\n` +
//       `Device: ${deviceId}\n` +
//       `Timestamp: ${new Date(record.timestamp).toLocaleString()}\n` +
//       `Previous Good Value: ${record.previousValue?.toFixed(3)} m³\n` +
//       `Garbage Value: ${record.currentValue?.toFixed(3)} m³\n` +
//       `Drop: ${record.dropAmount} m³ (${record.dropPercentage}%)\n\n` +
//       `Are you sure you want to delete this garbage data entry?\n` +
//       `This action cannot be undone!`
//     );
    
//     if (!userConfirmed) return;
    
//     setDeletingId(record._id);
    
//     try {
//       await API.delete(`/sensor-data/${record._id}`);
//       console.log(`Deleted record ${record._id} successfully`);
      
//       // Refresh the data after deletion
//       await fetchAllDevicesGarbageData();
//       alert(`✅ Successfully deleted garbage data entry from ${new Date(record.timestamp).toLocaleString()}`);
//     } catch (error) {
//       console.error("Error deleting data:", error);
//       alert(`❌ Failed to delete: ${error.message}`);
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Get all devices that have _10 suffix to exclude
//   const getExcludedDeviceIds = (allDevices) => {
//     const excludedIds = new Set();
    
//     allDevices.forEach(device => {
//       const deviceId = device.device_id || device.id;
//       if (deviceId && String(deviceId).endsWith('_10')) {
//         excludedIds.add(String(deviceId));
//         // Extract base ID (without suffix)
//         const baseId = String(deviceId).split('_')[0];
//         excludedIds.add(baseId);
//         console.log(`Will exclude: ${deviceId} and base: ${baseId}`);
//       }
//     });
    
//     return excludedIds;
//   };

//   const fetchAllDevicesGarbageData = async () => {
//     try {
//       setRefreshing(true);
//       setScanProgress({ current: 0, total: 0 });
      
//       // Fetch all devices
//       const devicesResponse = await API.get('/devices');
//       let allDevices = [];
      
//       if (devicesResponse.data && Array.isArray(devicesResponse.data)) {
//         allDevices = devicesResponse.data;
//       } else if (devicesResponse.data && Array.isArray(devicesResponse.data.devices)) {
//         allDevices = devicesResponse.data.devices;
//       }
      
//       if (allDevices.length === 0) {
//         setDevicesWithGarbage([]);
//         setLoading(false);
//         setRefreshing(false);
//         return;
//       }
      
//       // Get excluded device IDs (those ending with _10 and their base IDs)
//       const excludedIds = getExcludedDeviceIds(allDevices);
      
//       // Filter devices: only "flow-meter" type and not excluded
//       const filteredDevices = allDevices.filter(device => {
//         const deviceId = device.device_id || device.id;
//         if (!deviceId) return false;
        
//         const idStr = String(deviceId);
        
//         // Check if device ID or its base ID is excluded
//         const baseId = idStr.split('_')[0];
//         if (excludedIds.has(idStr) || excludedIds.has(baseId)) {
//           console.log(`Excluding ${deviceId}: matches excluded pattern`);
//           return false;
//         }
        
//         // Only include flow-meter devices
//         return isFlowMeter(device);
//       });
      
//       console.log(`Total devices: ${allDevices.length}, Flow-meters: ${filteredDevices.length}`);
//       setScanProgress({ current: 0, total: filteredDevices.length });
      
//       const devicesWithIssues = [];
      
//       // Process filtered devices in parallel
//       const promises = filteredDevices.map(async (device, index) => {
//         const deviceId = device.device_id || device.id;
//         if (!deviceId) return null;
        
//         try {
//           const sensorResponse = await API.get(`/sensor-data/device/${deviceId}`);
//           let sensorData = [];
          
//           if (sensorResponse.data && Array.isArray(sensorResponse.data)) {
//             sensorData = sensorResponse.data;
//           } else if (sensorResponse.data && Array.isArray(sensorResponse.data.data)) {
//             sensorData = sensorResponse.data.data;
//           }
          
//           setScanProgress(prev => ({ ...prev, current: index + 1 }));
          
//           if (sensorData.length < 2) return null;
          
//           const garbageRecords = detectCriticalCumulativeFlowDrop(sensorData);
          
//           if (garbageRecords.length > 0) {
//             return {
//               device_id: deviceId,
//               device_name: device.device_name || device.name || deviceId,
//               device_type: device.device_type || device.type || "flow-meter",
//               device_location: device.device_location || device.location || "Unknown",
//               device_site_name: device.device_site_name,
//               totalGarbageRecords: garbageRecords.length,
//               totalReadings: sensorData.length,
//               garbageRecords: garbageRecords,
//               firstGarbageDate: garbageRecords[0]?.createdAt,
//               lastGarbageDate: garbageRecords[garbageRecords.length - 1]?.createdAt
//             };
//           }
//         } catch (error) {
//           console.error(`Error processing ${deviceId}:`, error);
//         }
//         return null;
//       });
      
//       const results = await Promise.all(promises);
//       const validResults = results.filter(r => r !== null);
      
//       validResults.sort((a, b) => b.totalGarbageRecords - a.totalGarbageRecords);
//       setDevicesWithGarbage(validResults);
      
//     } catch (error) {
//       console.error("Error fetching garbage data:", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//       setScanProgress({ current: 0, total: 0 });
//     }
//   };

//   useEffect(() => {
//     fetchAllDevicesGarbageData();
    
//     const interval = setInterval(() => {
//       fetchAllDevicesGarbageData();
//     }, 60000);
    
//     return () => clearInterval(interval);
//   }, []);

//   const getSeverityBadge = () => {
//     return <span className="severity-badge critical">CRITICAL</span>;
//   };

//   const filteredDevices = devicesWithGarbage.filter(device =>
//     device.device_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (device.device_name && device.device_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//     (device.device_location && device.device_location.toLowerCase().includes(searchTerm.toLowerCase())) ||
//     (device.device_site_name && device.device_site_name.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const totalGarbageRecords = devicesWithGarbage.reduce((sum, device) => sum + device.totalGarbageRecords, 0);

//   if (loading) {
//     return (
//       <div className="alerts-container">
//         <div className="loading-container">
//           <motion.div
//             className="loading-spinner"
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           />
//           <p>Scanning flow-meters for critical cumulative flow drops...</p>
//           {scanProgress.total > 0 && (
//             <div className="progress-bar-container">
//               <div 
//                 className="progress-bar" 
//                 style={{ width: `${(scanProgress.current / scanProgress.total) * 100}%` }}
//               />
//               <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
//                 Checking flow-meter {scanProgress.current} of {scanProgress.total}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="alerts-container">
//       {/* Header */}
//       <div className="alerts-header">
//         <motion.div
//           className="header-content"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <div className="header-title">
//             <FaTachometerAlt className="header-icon" />
//             <h1>Flow-Meter - Critical Drop Detection</h1>
//             <span className="device-count">{totalGarbageRecords} critical drops</span>
//           </div>
//           <p className="header-subtitle">
//             Found in {devicesWithGarbage.length} flow-meters | Last scan: {new Date().toLocaleTimeString()}
//           </p>
//           <p className="header-note">
//             🔍 Only showing devices with type: <strong>flow-meter</strong>
//             <br />
//             🚫 Excluding devices with _10 suffix and their matching base IDs
//             <br />
//             ⚠️ Detecting cumulative flow drops &gt;80% | Values &gt;10 are ignored
//             <br />
//             📌 Exact 0 values (device offline) are ignored
//             <br />
//             🗑️ Click delete icon to remove garbage data (verification required)
//           </p>
//         </motion.div>
//       </div>

//       {/* Controls */}
//       <div className="alerts-controls">
//         <div className="search-container">
//           <FaSearch className="search-icon" />
//           <input
//             type="text"
//             placeholder="Search by device ID, name, or location..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//         </div>
//         <motion.button
//           onClick={fetchAllDevicesGarbageData}
//           disabled={refreshing}
//           className="refresh-btn"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <FaSync className={refreshing ? 'spinning' : ''} />
//           {refreshing ? 'Scanning...' : 'Scan Now'}
//         </motion.button>
//       </div>

//       {/* Devices List */}
//       <div className="devices-list">
//         {filteredDevices.length === 0 ? (
//           <div className="no-devices">
//             {searchTerm ? 'No flow-meters match your search' : 'No critical drops detected in flow-meters'}
//             {devicesWithGarbage.length === 0 && !searchTerm && (
//               <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.7 }}>
//                 ✅ All flow-meters have normal cumulative flow (monotonically increasing)
//                 <br />
//                 <span style={{ fontSize: '0.8rem' }}>📌 Only devices with type "flow-meter" are scanned</span>
//                 <br />
//                 <span style={{ fontSize: '0.8rem' }}>📌 Devices with _10 suffix and their matches are excluded</span>
//                 <br />
//                 <span style={{ fontSize: '0.8rem' }}>📌 Values &gt;10 are ignored (not garbage)</span>
//                 <br />
//                 <span style={{ fontSize: '0.8rem' }}>📌 Exact 0 values (device offline) are ignored</span>
//               </div>
//             )}
//           </div>
//         ) : (
//           filteredDevices.map((device, index) => (
//             <motion.div
//               key={device.device_id}
//               className="device-card"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
//             >
//               <div 
//                 className="device-header"
//                 onClick={() => setExpandedDevice(expandedDevice === device.device_id ? null : device.device_id)}
//               >
//                 <div className="device-info">
//                   <FaExclamationTriangle className="device-warning-icon" />
//                   <div>
//                     <h3>{device.device_id}</h3>
//                     <div className="device-meta">
//                       <span className="device-type-badge flow-meter">flow-meter</span>
//                       {device.device_location && <span>📍 {device.device_location}</span>}
//                       {device.device_site_name && <span> • 🏭 {device.device_site_name}</span>}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="device-stats">
//                   <span className="garbage-badge critical-badge">{device.totalGarbageRecords} critical drops</span>
//                   <span className={`expand-icon ${expandedDevice === device.device_id ? 'expanded' : ''}`}>▼</span>
//                 </div>
//               </div>

//               {expandedDevice === device.device_id && (
//                 <motion.div 
//                   className="device-details"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <div className="summary-info">
//                     <div className="summary-item">
//                       <span className="label">Device Type:</span>
//                       <span className="value"><strong>flow-meter</strong></span>
//                     </div>
//                     <div className="summary-item">
//                       <span className="label">Total Readings:</span>
//                       <span className="value">{device.totalReadings}</span>
//                     </div>
//                     <div className="summary-item">
//                       <span className="label">Critical Drops:</span>
//                       <span className="value" style={{ color: '#dc2626', fontWeight: 'bold' }}>{device.totalGarbageRecords}</span>
//                     </div>
//                   </div>

//                   <div className="garbage-records">
//                     <h4>Critical Cumulative Flow Drops (&gt;80% drop & value ≤ 10):</h4>
//                     <div className="table-wrapper">
//                       <table className="garbage-table">
//                         <thead>
//                           <tr>
//                             <th>Timestamp</th>
//                             <th>Flow Rate (m³/hr)</th>
//                             <th>Previous Good Value (m³)</th>
//                             <th>Garbage Value (m³)</th>
//                             <th>Drop Amount</th>
//                             <th>Drop %</th>
//                             <th>Severity</th>
//                             <th>Action</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {device.garbageRecords.map((record, idx) => (
//                             <tr key={idx} className="garbage-row critical-row">
//                               <td>{new Date(record.timestamp).toLocaleString()}</td>
//                               <td>{record.data2?.toFixed(2)} m³/hr</td>
//                               <td className="expected-value">{record.previousValue?.toFixed(3)} m³</td>
//                               <td className="garbage-value">{record.currentValue?.toFixed(3)} m³</td>
//                               <td className="garbage-value">- {record.dropAmount} m³</td>
//                               <td className="garbage-value">{record.dropPercentage}%</td>
//                               <td>{getSeverityBadge()}</td>
//                               <td className="action-cell">
//                                 <button
//                                   onClick={() => handleDelete(record, device.device_id)}
//                                   disabled={deletingId === record._id}
//                                   className="delete-garbage-btn"
//                                   title="Delete this garbage data entry"
//                                 >
//                                   {deletingId === record._id ? (
//                                     <span className="deleting-spinner">⏳</span>
//                                   ) : (
//                                     <FaTrash />
//                                   )}
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>

//                   <div className="context-info">
//                     <div className="critical-warning">
//                       <FaExclamationTriangle style={{ marginRight: '0.5rem' }} />
//                       <strong>CRITICAL ISSUE:</strong> Cumulative flow dropped by &gt;80% (value ≤ 10)
//                     </div>
//                     <div className="context-record" style={{ background: 'rgba(220, 38, 38, 0.15)', borderLeft: '3px solid #dc2626', marginTop: '1rem' }}>
//                       <div className="context-values">
//                         <span>⚠️ Cumulative flow should NEVER decrease</span>
//                         <span>⚠️ This indicates GARBAGE data from flow-meter</span>
//                         <span>⚠️ Click the delete button to remove (verification required)</span>
//                         <span style={{ color: '#fbbf24' }}>📌 Only flow-meter devices are shown</span>
//                         <span style={{ color: '#fbbf24' }}>📌 Devices with _10 suffix and their matches are excluded</span>
//                         <span style={{ color: '#fbbf24' }}>📌 Values &gt;10 are ignored (not considered garbage)</span>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </motion.div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default AlertsPage;
// export default AlertsPage;
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FaExclamationTriangle,
  FaSearch,
  FaSync,
  FaTrash,
  FaTachometerAlt,
  FaCheck,
  FaTimes
} from "react-icons/fa";
import API from "../services/api";
import "../styles/AlertsPage.css";

const AlertsPage = () => {
  const [devicesWithGarbage, setDevicesWithGarbage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDevice, setExpandedDevice] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [scanProgress, setScanProgress] = useState({ current: 0, total: 0 });
  const [deletingId, setDeletingId] = useState(null);

  // Check if device is specifically "flow-meter"
  const isFlowMeter = (device) => {
    const deviceType = (device.device_type || device.type || "").toLowerCase();
    const deviceName = (device.device_name || device.name || "").toLowerCase();
    
    return deviceType === 'flow-meter' || 
           deviceType.includes('flow-meter') ||
           deviceName === 'flow-meter' ||
           deviceName.includes('flow-meter');
  };

  // Thorough check for CRITICAL Total Cumulative Flow (data3) drops
  const detectCriticalCumulativeFlowDrop = (sensorData) => {
    if (!sensorData || sensorData.length < 2) return [];
    
    const sortedData = [...sensorData].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );
    
    const garbageRecords = [];
    let lastGoodValue = null;
    let lastGoodRecord = null;
    
    for (let i = 0; i < sortedData.length; i++) {
      const current = sortedData[i];
      
      if (current.data3 === undefined) continue;
      
      if (lastGoodValue === null) {
        lastGoodValue = current.data3;
        lastGoodRecord = current;
        continue;
      }
      
      if (current.data3 === 0) continue;
      
      if (current.data3 < lastGoodValue) {
        const dropAmount = (lastGoodValue - current.data3).toFixed(3);
        const dropPercentage = ((lastGoodValue - current.data3) / lastGoodValue) * 100;
        
        if (current.data3 > 10) {
          if (current.data3 >= lastGoodValue * 0.8) {
            lastGoodValue = current.data3;
            lastGoodRecord = current;
          }
          continue;
        }
        
        if (dropPercentage > 80) {
          garbageRecords.push({
            ...current,
            _id: current._id,
            garbageType: "CRITICAL Flow Drop",
            previousValue: lastGoodValue,
            currentValue: current.data3,
            dropAmount: dropAmount,
            dropPercentage: dropPercentage.toFixed(2),
            previousRecord: lastGoodRecord,
            timestamp: current.createdAt,
            severity: "Critical"
          });
        }
      } else {
        if (current.data3 >= lastGoodValue) {
          lastGoodValue = current.data3;
          lastGoodRecord = current;
        }
      }
    }
    
    return garbageRecords;
  };

  // Get all devices that have _10 suffix to exclude
  const getExcludedDeviceIds = (allDevices) => {
    const excludedIds = new Set();
    
    allDevices.forEach(device => {
      const deviceId = device.device_id || device.id;
      if (deviceId && String(deviceId).endsWith('_10')) {
        excludedIds.add(String(deviceId));
        const baseId = String(deviceId).split('_')[0];
        excludedIds.add(baseId);
      }
    });
    
    return excludedIds;
  };

  // Fast delete - removes from UI immediately without full refresh
  const handleDelete = async (record, deviceId) => {
    const userConfirmed = window.confirm(
      `⚠️ VERIFY BEFORE DELETING ⚠️\n\n` +
      `Device: ${deviceId}\n` +
      `Timestamp: ${new Date(record.timestamp).toLocaleString()}\n` +
      `Previous Good Value: ${record.previousValue?.toFixed(3)} m³\n` +
      `Garbage Value: ${record.currentValue?.toFixed(3)} m³\n` +
      `Drop: ${record.dropAmount} m³ (${record.dropPercentage}%)\n\n` +
      `Are you sure you want to delete this garbage data entry?\n` +
      `This action cannot be undone!`
    );
    
    if (!userConfirmed) return;
    
    setDeletingId(record._id);
    
    try {
      await API.delete(`/sensor-data/${record._id}`);
      
      // Remove from UI immediately - MUCH FASTER
      setDevicesWithGarbage(prevDevices => {
        return prevDevices.map(device => {
          if (device.device_id === deviceId) {
            const updatedRecords = device.garbageRecords.filter(r => r._id !== record._id);
            
            // If no garbage records left for this device, remove the device entirely
            if (updatedRecords.length === 0) {
              return null;
            }
            
            return {
              ...device,
              totalGarbageRecords: updatedRecords.length,
              garbageRecords: updatedRecords,
              lastGarbageDate: updatedRecords[updatedRecords.length - 1]?.createdAt
            };
          }
          return device;
        }).filter(device => device !== null);
      });
      
      console.log(`Deleted record ${record._id} successfully`);
      
    } catch (error) {
      console.error("Error deleting data:", error);
      alert(`❌ Failed to delete: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const fetchAllDevicesGarbageData = async () => {
    try {
      setRefreshing(true);
      setScanProgress({ current: 0, total: 0 });
      
      const devicesResponse = await API.get('/devices');
      let allDevices = [];
      
      if (devicesResponse.data && Array.isArray(devicesResponse.data)) {
        allDevices = devicesResponse.data;
      } else if (devicesResponse.data && Array.isArray(devicesResponse.data.devices)) {
        allDevices = devicesResponse.data.devices;
      }
      
      if (allDevices.length === 0) {
        setDevicesWithGarbage([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      const excludedIds = getExcludedDeviceIds(allDevices);
      
      const filteredDevices = allDevices.filter(device => {
        const deviceId = device.device_id || device.id;
        if (!deviceId) return false;
        
        const idStr = String(deviceId);
        const baseId = idStr.split('_')[0];
        
        if (excludedIds.has(idStr) || excludedIds.has(baseId)) {
          return false;
        }
        
        return isFlowMeter(device);
      });
      
      setScanProgress({ current: 0, total: filteredDevices.length });
      
      const devicesWithIssues = [];
      
      // Process in smaller batches to avoid overwhelming
      const batchSize = 5;
      for (let i = 0; i < filteredDevices.length; i += batchSize) {
        const batch = filteredDevices.slice(i, i + batchSize);
        const batchPromises = batch.map(async (device, batchIndex) => {
          const deviceId = device.device_id || device.id;
          if (!deviceId) return null;
          
          try {
            const sensorResponse = await API.get(`/sensor-data/device/${deviceId}`);
            let sensorData = [];
            
            if (sensorResponse.data && Array.isArray(sensorResponse.data)) {
              sensorData = sensorResponse.data;
            } else if (sensorResponse.data && Array.isArray(sensorResponse.data.data)) {
              sensorData = sensorResponse.data.data;
            }
            
            setScanProgress(prev => ({ ...prev, current: prev.current + 1 }));
            
            if (sensorData.length < 2) return null;
            
            const garbageRecords = detectCriticalCumulativeFlowDrop(sensorData);
            
            if (garbageRecords.length > 0) {
              return {
                device_id: deviceId,
                device_name: device.device_name || device.name || deviceId,
                device_type: device.device_type || device.type || "flow-meter",
                device_location: device.device_location || device.location || "Unknown",
                device_site_name: device.device_site_name,
                totalGarbageRecords: garbageRecords.length,
                totalReadings: sensorData.length,
                garbageRecords: garbageRecords,
                firstGarbageDate: garbageRecords[0]?.createdAt,
                lastGarbageDate: garbageRecords[garbageRecords.length - 1]?.createdAt
              };
            }
          } catch (error) {
            console.error(`Error processing ${deviceId}:`, error);
          }
          return null;
        });
        
        const batchResults = await Promise.all(batchPromises);
        const validBatchResults = batchResults.filter(r => r !== null);
        devicesWithIssues.push(...validBatchResults);
      }
      
      devicesWithIssues.sort((a, b) => b.totalGarbageRecords - a.totalGarbageRecords);
      setDevicesWithGarbage(devicesWithIssues);
      
    } catch (error) {
      console.error("Error fetching garbage data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setScanProgress({ current: 0, total: 0 });
    }
  };

  useEffect(() => {
    fetchAllDevicesGarbageData();
    
    const interval = setInterval(() => {
      fetchAllDevicesGarbageData();
    }, 120000); // Increased to 2 minutes for better performance
    
    return () => clearInterval(interval);
  }, []);

  const getSeverityBadge = () => {
    return <span className="severity-badge critical">CRITICAL</span>;
  };

  const filteredDevices = devicesWithGarbage.filter(device =>
    device.device_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (device.device_name && device.device_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (device.device_location && device.device_location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (device.device_site_name && device.device_site_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalGarbageRecords = devicesWithGarbage.reduce((sum, device) => sum + device.totalGarbageRecords, 0);

  if (loading) {
    return (
      <div className="alerts-container">
        <div className="loading-container">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p>Scanning flow-meters for critical cumulative flow drops...</p>
          {scanProgress.total > 0 && (
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ width: `${(scanProgress.current / scanProgress.total) * 100}%` }}
              />
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Checking flow-meter {scanProgress.current} of {scanProgress.total}
              </p>
            </div>
          )}
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
            <FaTachometerAlt className="header-icon" />
            <h1>Flow-Meter - Critical Drop Detection</h1>
            <span className="device-count">{totalGarbageRecords} critical drops</span>
          </div>
          <p className="header-subtitle">
            Found in {devicesWithGarbage.length} flow-meters | Last scan: {new Date().toLocaleTimeString()}
          </p>
          <p className="header-note">
            🔍 Only showing devices with type: <strong>flow-meter</strong>
            <br />
            🚫 Excluding devices with _10 suffix and their matching base IDs
            <br />
            ⚠️ Detecting cumulative flow drops &gt;80% | Values &gt;10 are ignored
            <br />
            📌 Exact 0 values (device offline) are ignored
            <br />
            🗑️ Click delete icon to remove garbage data (instant removal)
          </p>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="alerts-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by device ID, name, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <motion.button
          onClick={fetchAllDevicesGarbageData}
          disabled={refreshing}
          className="refresh-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaSync className={refreshing ? 'spinning' : ''} />
          {refreshing ? 'Scanning...' : 'Scan Now'}
        </motion.button>
      </div>

      {/* Devices List */}
      <div className="devices-list">
        {filteredDevices.length === 0 ? (
          <div className="no-devices">
            {searchTerm ? 'No flow-meters match your search' : 'No critical drops detected in flow-meters'}
            {devicesWithGarbage.length === 0 && !searchTerm && (
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.7 }}>
                ✅ All flow-meters have normal cumulative flow
              </div>
            )}
          </div>
        ) : (
          filteredDevices.map((device, index) => (
            <motion.div
              key={device.device_id}
              className="device-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
            >
              <div 
                className="device-header"
                onClick={() => setExpandedDevice(expandedDevice === device.device_id ? null : device.device_id)}
              >
                <div className="device-info">
                  <FaExclamationTriangle className="device-warning-icon" />
                  <div>
                    <h3>{device.device_id}</h3>
                    <div className="device-meta">
                      <span className="device-type-badge flow-meter">flow-meter</span>
                      {device.device_location && <span>📍 {device.device_location}</span>}
                      {device.device_site_name && <span> • 🏭 {device.device_site_name}</span>}
                    </div>
                  </div>
                </div>
                <div className="device-stats">
                  <span className="garbage-badge critical-badge">{device.totalGarbageRecords} critical drops</span>
                  <span className={`expand-icon ${expandedDevice === device.device_id ? 'expanded' : ''}`}>▼</span>
                </div>
              </div>

              {expandedDevice === device.device_id && (
                <motion.div 
                  className="device-details"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="summary-info">
                    <div className="summary-item">
                      <span className="label">Device Type:</span>
                      <span className="value"><strong>flow-meter</strong></span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Total Readings:</span>
                      <span className="value">{device.totalReadings}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Critical Drops:</span>
                      <span className="value" style={{ color: '#dc2626', fontWeight: 'bold' }}>{device.totalGarbageRecords}</span>
                    </div>
                  </div>

                  <div className="garbage-records">
                    <h4>Critical Cumulative Flow Drops (&gt;80% drop & value ≤ 10):</h4>
                    <div className="table-wrapper">
                      <table className="garbage-table">
                        <thead>
                          <tr>
                            <th>Timestamp</th>
                            <th>Flow Rate (m³/hr)</th>
                            <th>Previous Good Value (m³)</th>
                            <th>Garbage Value (m³)</th>
                            <th>Drop Amount</th>
                            <th>Drop %</th>
                            <th>Severity</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {device.garbageRecords.map((record, idx) => (
                            <tr key={record._id || idx} className="garbage-row critical-row">
                              <td>{new Date(record.timestamp).toLocaleString()}</td>
                              <td>{record.data2?.toFixed(2)} m³/hr</td>
                              <td className="expected-value">{record.previousValue?.toFixed(3)} m³</td>
                              <td className="garbage-value">{record.currentValue?.toFixed(3)} m³</td>
                              <td className="garbage-value">- {record.dropAmount} m³</td>
                              <td className="garbage-value">{record.dropPercentage}%</td>
                              <td>{getSeverityBadge()}</td>
                              <td className="action-cell">
                                <button
                                  onClick={() => handleDelete(record, device.device_id)}
                                  disabled={deletingId === record._id}
                                  className="delete-garbage-btn"
                                  title="Delete this garbage data entry"
                                >
                                  {deletingId === record._id ? (
                                    <span className="deleting-spinner">⏳</span>
                                  ) : (
                                    <FaTrash />
                                  )}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="context-info">
                    <div className="critical-warning">
                      <FaExclamationTriangle style={{ marginRight: '0.5rem' }} />
                      <strong>CRITICAL ISSUE:</strong> Cumulative flow dropped by &gt;80% (value ≤ 10)
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPage;