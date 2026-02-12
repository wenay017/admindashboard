// // export default SingleDeviceSensorData;
// import React, { useEffect, useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaFileImport, FaEdit, FaTrash, FaSpinner, FaCheck, FaTimes, FaRegSquare, FaRegCheckSquare } from "react-icons/fa";
// import Papa from "papaparse";
// import API from "../services/api"; // Assuming this is your API client
// import SensorGraph from "./DeviceGraphs"; // Assuming this component exists
// import "../styles/SingleDeviceSensorData.css"; // Assuming your CSS for this component

// const ITEMS_PER_PAGE = 20;

// const SingleDeviceSensorData = ({ deviceId }) => {
//   const [sensorData, setSensorData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showGraph, setShowGraph] = useState(false);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [showImportModal, setShowImportModal] = useState(false);
//   const [fileData, setFileData] = useState([]);
//   const [fileHeaders, setFileHeaders] = useState([]);
//   const [fieldMapping, setFieldMapping] = useState({
//     data1: "",
//     data2: "",
//     data3: "",
//     data4: "",
//     data5: "",
//     data6: "",
//     interval: "",
//     timestamp: "" // This maps to 'createdAt' in the backend
//   });
//   const [uploadProgress, setUploadProgress] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editFormData, setEditFormData] = useState({
//     data1: "",
//     data2: "",
//     data3: "",
//     data4: "",
//     data5: "",
//     data6: "",
//     interval: "",
//     createdAt: "" // Use 'createdAt' directly for editing
//   });
//   const [selectedData, setSelectedData] = useState([]);
  
//   const abortControllerRef = useRef(null);
//   const [isImportCancelled, setIsImportCancelled] = useState(false);

//   // Animation variants (same as before)
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         when: "beforeChildren",
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         duration: 0.5,
//       },
//     },
//   };

//   const rowVariants = {
//     hidden: { opacity: 0, x: -30 },
//     visible: (i) => ({
//       opacity: 1,
//       x: 0,
//       transition: {
//         delay: i * 0.05,
//         duration: 0.5,
//       },
//     }),
//   };

//   const graphVariants = {
//     hidden: { opacity: 0, height: 0 },
//     visible: {
//       opacity: 1,
//       height: "auto",
//       transition: {
//         duration: 0.5,
//       },
//     },
//     exit: {
//       opacity: 0,
//       height: 0,
//       transition: {
//         duration: 0.3,
//       },
//     },
//   };

//   const modalVariants = {
//     hidden: { opacity: 0, scale: 0.9 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       transition: { duration: 0.3 }
//     },
//     exit: {
//       opacity: 0,
//       scale: 0.9,
//       transition: { duration: 0.2 }
//     }
//   };

//   // Function to parse various date string formats
//   const parseDateString = (dateStr) => {
//     if (!dateStr) return null;
//     const s = String(dateStr).trim();

//     // Helper to create a date object and validate it
//     const createValidatedDate = (year, month, day, hour = 0, minute = 0, second = 0) => {
//       const d = new Date(year, month - 1, day, hour, minute, second);
//       // Basic validation: Check if the date components used to create the Date object
//       // match what Date object internally stores (handles invalid dates like Feb 30)
//       if (d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) {
//         return d;
//       }
//       return null; // Return null if the date is invalid (e.g., non-existent day or month)
//     };

//     let match;

//     // 1. YYYY-MM-DD[T| ]HH:MM:SS or YYYY-MM-DD (ISO-like format)
//     // Examples: "2019-08-01 00:00:00", "2019-08-01T00:00:00", "2019-08-01"
//     match = s.match(/^(\d{4})[-/](\d{2})[-/](\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
//     if (match) {
//       const [_, year, month, day, hour, minute, second] = match;
//       const date = createValidatedDate(
//         parseInt(year),
//         parseInt(month),
//         parseInt(day),
//         hour ? parseInt(hour) : 0,
//         minute ? parseInt(minute) : 0,
//         second ? parseInt(second) : 0
//       );
//       if (date) return date;
//     }

//     // 2. DD-MM-YYYY[ ]HH:MM:SS or DD-MM-YYYY
//     // Examples: "01-08-2019 00:00", "01/08/2019", "25-12-2023"
//     // Prioritize this as it matches the user's sample "01-08-2019" as August 1st.
//     match = s.match(/^(\d{2})[-/](\d{2})[-/](\d{4})(?:[\sT](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
//     if (match) {
//       const [_, day, month, year, hour, minute, second] = match;
//       const date = createValidatedDate(
//         parseInt(year),
//         parseInt(month),
//         parseInt(day),
//         hour ? parseInt(hour) : 0,
//         minute ? parseInt(minute) : 0,
//         second ? parseInt(second) : 0
//       );
//       if (date) return date; // Return if valid
//     }

//     // 3. MM-DD-YYYY[ ]HH:MM:SS or MM-DD-YYYY
//     // Examples: "08-01-2019 00:00", "08/01/2019", "12-25-2023"
//     // This uses the same regex pattern, but the interpretation of day/month is swapped.
//     // It will be tried if the previous patterns did not yield a valid date.
//     match = s.match(/^(\d{2})[-/](\d{2})[-/](\d{4})(?:[\sT](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
//     if (match) {
//       const [_, month, day, year, hour, minute, second] = match; // Swapped for MM-DD-YYYY
//       const date = createValidatedDate(
//         parseInt(year),
//         parseInt(month),
//         parseInt(day),
//         hour ? parseInt(hour) : 0,
//         minute ? parseInt(minute) : 0,
//         second ? parseInt(second) : 0
//       );
//       if (date) return date;
//     }

//     // Fallback: Try native Date parsing for other formats (less reliable but can catch some edge cases)
//     // Only use if other explicit regex patterns failed, as native parsing can be locale-dependent.
//     try {
//       const d = new Date(s);
//       if (!isNaN(d.getTime())) {
//         console.warn("Using native Date parser as fallback for:", s);
//         return d;
//       }
//     } catch (e) {
//       // Log error but continue as we handle failure by returning null
//       console.warn("Native Date parsing threw an error for:", s, e);
//     }

//     console.warn("Failed to parse date string with any known format:", s);
//     return null; // Return null if no valid date could be parsed
//   };

//   useEffect(() => {
//     const fetchSensorData = async () => {
//       try {
//         setLoading(true);
//         const res = await API.get(`/sensor-data/device/${deviceId}`);
//         const formattedData = res.data.map((item, index) => ({
//           ...item,
//           rawDate: new Date(item.createdAt), // Store raw Date object for filtering
//           _id: item._id || `row-${index}-${Date.now()}`, // Ensure unique IDs for local operations
//         }));
//         setSensorData(formattedData);
//         setFilteredData(formattedData);
//       } catch (error) {
//         console.error("Error fetching sensor data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSensorData();
//   }, [deviceId]);

//   useEffect(() => {
//     if (!fromDate && !toDate) {
//       setFilteredData(sensorData);
//       return;
//     }

//     const from = fromDate ? new Date(fromDate) : null;
//     let to = toDate ? new Date(toDate) : null;
    
//     // Adjust 'to' date to include the entire day until midnight
//     if (to) {
//         to.setHours(23, 59, 59, 999);
//     }
    
//     const filtered = sensorData.filter((item) => {
//       const itemDate = new Date(item.createdAt); // Use item.createdAt directly to avoid a stale rawDate
      
//       const isAfterFrom = !from || itemDate >= from;
//       const isBeforeTo = !to || itemDate <= to;
      
//       return isAfterFrom && isBeforeTo;
//     });

//     setFilteredData(filtered);
//     setCurrentPage(1);
//   }, [fromDate, toDate, sensorData]);

//   const downloadCSV = () => {
//     if (filteredData.length === 0) return;
    
//     const keys = Object.keys(filteredData[0]).filter(key => key !== 'rawDate');
//     const csvHeader = keys.map(key => {
//       switch(key) {
//         case 'data2': return 'Instantaneous Flow (m³/hr)';
//         case 'data3': return 'Total Cumulative Flow (m³)';
//         case 'data4': return 'Positive Cumulative Flow (m³)';
//         case 'data5': return 'Negative Cumulative Flow (m³)';
//         case 'data6': return 'Water Temperature (°C)';
//         case 'createdAt': return 'Timestamp';
//         default: return key;
//       }
//     }).join(',') + '\n';
    
//     const csvRows = filteredData.map(item => {
//       return keys.map(key => {
//         const value = item[key];
//         if (typeof value === 'object' && value !== null) {
//           return JSON.stringify(value);
//         }
//         return value !== null && value !== undefined ? value.toString() : '';
//       }).join(',');
//     }).join('\n');
    
//     const csvContent = csvHeader + csvRows;
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `water-flow-data-${deviceId}-${new Date().toISOString().split('T')[0]}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const toggleGraph = () => {
//     setShowGraph(prev => !prev);
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     Papa.parse(file, {
//       header: true,
//       skipEmptyLines: true,
//       complete: (results) => {
//         const cleanData = results.data.filter(row => Object.values(row).some(val => val));
//         setFileData(cleanData);
//         setFileHeaders(Object.keys(cleanData[0] || {}));
//         setShowImportModal(true);
//       },
//       error: (error) => {
//         console.error("Error parsing CSV:", error);
//       }
//     });
//   };

//   const handleFieldMappingChange = (e, field) => {
//     setFieldMapping({
//       ...fieldMapping,
//       [field]: e.target.value
//     });
//   };

//   const uploadData = async () => {
//     if (!fileData.length) return;

//     setIsImportCancelled(false);
//     abortControllerRef.current = new AbortController();

//     setUploadProgress({
//       total: fileData.length,
//       processed: 0,
//       success: 0,
//       failed: 0
//     });

//     const payloadChunks = [];
//     const chunkSize = 50; 

//     for (let i = 0; i < fileData.length; i += chunkSize) {
//       const chunk = fileData.slice(i, i + chunkSize);
//       payloadChunks.push(chunk);
//     }

//     let successfulUploads = 0;
//     let failedUploads = 0;
//     let processedCount = 0;

//     for (const chunk of payloadChunks) {
//       if (isImportCancelled) {
//         break;
//       }
//       const uploadPromises = chunk.map(async (row) => {
//         if (isImportCancelled) {
//           return { status: 'cancelled' };
//         }
        
//         const payload = {
//             device_id: deviceId,
//             data1: 0, data2: 0, data3: 0, data4: 0, data5: 0, data6: 0, interval: 0,
//         };

//         const mapAndParse = (field) => {
//             const header = fieldMapping[field];
//             return header && row[header] !== undefined
//                 ? parseFloat(row[header]) || 0
//                 : 0;
//         };

//         payload.data1 = mapAndParse('data1');
//         payload.data2 = mapAndParse('data2');
//         payload.data3 = mapAndParse('data3');
//         payload.data4 = mapAndParse('data4');
//         payload.data5 = mapAndParse('data5');
//         payload.data6 = mapAndParse('data6');
//         payload.interval = mapAndParse('interval');

//         const parsedDate = fieldMapping.timestamp && row[fieldMapping.timestamp]
//             ? parseDateString(row[fieldMapping.timestamp])
//             : null;
        
//         // Only set createdAt if parsedDate is valid, otherwise it's null/undefined
//         payload.createdAt = parsedDate ? parsedDate.toISOString() : null;

//         try {
//             await API.post('/sensor-data', payload, { signal: abortControllerRef.current.signal });
//             return { status: 'success' };
//         } catch (error) {
//             if (error.name === 'AbortError') {
//               return { status: 'cancelled' };
//             }
//             console.error("Error uploading row:", error);
//             return { status: 'failed' };
//         }
//       });

//       const results = await Promise.all(uploadPromises);

//       successfulUploads += results.filter(res => res.status === 'success').length;
//       failedUploads += results.filter(res => res.status === 'failed').length;
//       processedCount += chunk.length;

//       setUploadProgress(prev => ({
//           ...prev,
//           processed: processedCount,
//           success: successfulUploads,
//           failed: failedUploads,
//       }));
//     }

//     // Refresh data after upload is complete or cancelled
//     if (!isImportCancelled) {
//       setTimeout(() => {
//         const fetchSensorData = async () => {
//           try {
//             setLoading(true);
//             const res = await API.get(`/sensor-data/device/${deviceId}`);
//             const formattedData = res.data.map((item, index) => ({
//               ...item,
//               rawDate: new Date(item.createdAt),
//               _id: item._id || `row-${index}-${Date.now()}`,
//             }));
//             setSensorData(formattedData);
//             setFilteredData(formattedData);
//           } catch (error) {
//             console.error("Error refreshing sensor data:", error);
//           } finally {
//             setLoading(false);
//           }
//         };
//         fetchSensorData();
//       }, 1000);
//     }
//   };

//   const handleCancelImport = () => {
//     setIsImportCancelled(true);
//     abortControllerRef.current?.abort();
//     setUploadProgress(prev => ({
//       ...prev,
//       processed: prev.total,
//       failed: prev.failed + (prev.total - prev.processed),
//     }));
//   };

//   const handleEditClick = (data) => {
//     setEditingId(data._id);
//     setEditFormData({
//       data1: data.data1 || "0",
//       data2: data.data2 || "0",
//       data3: data.data3 || "0",
//       data4: data.data4 || "0",
//       data5: data.data5 || "0",
//       data6: data.data6 || "0",
//       interval: data.interval || "0",
//       createdAt: data.createdAt ? new Date(data.createdAt).toISOString().slice(0, 16) : "" // Format for datetime-local input
//     });
//   };

//   const handleEditFormChange = (e) => {
//     const { name, value } = e.target;
//     setEditFormData({
//       ...editFormData,
//       [name]: value
//     });
//   };

//   const handleEditSubmit = async (id) => {
//     try {
//       const payload = {
//         device_id: deviceId,
//         ...editFormData
//       };

//       if (payload.createdAt) {
//         payload.createdAt = new Date(payload.createdAt).toISOString();
//       }

//       await API.put(`/sensor-data/${id}`, payload);
      
//       setSensorData(prevData =>
//         prevData.map(item =>
//           item._id === id ? { 
//             ...item, 
//             ...editFormData,
//             rawDate: payload.createdAt ? new Date(payload.createdAt) : item.rawDate // Update rawDate if createdAt changed
//           } : item
//         )
//       );
//       setFilteredData(prevData =>
//         prevData.map(item =>
//           item._id === id ? { 
//             ...item, 
//             ...editFormData,
//             rawDate: payload.createdAt ? new Date(payload.createdAt) : item.rawDate
//           } : item
//         )
//       );
      
//       setEditingId(null);
//     } catch (error) {
//       console.error("Error updating data:", error);
//     }
//   };

//   const handleSelectData = (id) => {
//     setSelectedData(prevSelected =>
//       prevSelected.includes(id)
//         ? prevSelected.filter(itemId => itemId !== id)
//         : [...prevSelected, id]
//     );
//   };

//   const handleSelectAll = () => {
//     const currentPageIds = currentData.map(item => item._id);
//     const allSelected = currentPageIds.every(id => selectedData.includes(id));
    
//     if (allSelected) {
//       setSelectedData(prevSelected => prevSelected.filter(id => !currentPageIds.includes(id)));
//     } else {
//       setSelectedData(prevSelected => [...new Set([...prevSelected, ...currentPageIds])]);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this data entry?")) {
//       try {
//         await API.delete(`/sensor-data/${id}`);
//         setSensorData(prevData => prevData.filter(item => item._id !== id));
//         setFilteredData(prevData => prevData.filter(item => item._id !== id));
//       } catch (error) {
//         console.error("Error deleting data:", error);
//       }
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (selectedData.length === 0) return;
//     if (window.confirm(`Are you sure you want to delete ${selectedData.length} selected data entries?`)) {
//       try {
//         await Promise.all(selectedData.map(id => API.delete(`/sensor-data/${id}`)));
//         setSensorData(prevData => prevData.filter(item => !selectedData.includes(item._id)));
//         setFilteredData(prevData => prevData.filter(item => !selectedData.includes(item._id)));
//         setSelectedData([]);
//       } catch (error) {
//         console.error("Error deleting data in bulk:", error);
//       }
//     }
//   };

//   const formatValue = (val, key) => {
//     if (val === null || val === undefined) return "-";
//     if (typeof val === "object") {
//       return JSON.stringify(val, null, 2);
//     }
    
//     if (key === 'createdAt' || key === 'updatedAt') {
//       return new Date(val).toLocaleString();
//     }
    
//     switch(key) {
//       case 'data2': 
//         return <>{parseFloat(val).toFixed(3)} <span className="data-unit">m³/hr</span></>;
//       case 'data3': 
//         return <>{parseFloat(val).toFixed(3)} <span className="data-unit">m³</span></>;
//       case 'data4': 
//         return <>{parseFloat(val).toFixed(3)} <span className="data-unit">m³</span></>;
//       case 'data5': 
//         return <>{parseFloat(val).toFixed(3)} <span className="data-unit">m³</span></>;
//       case 'data6': 
//         return <>{parseFloat(val).toFixed(2)} <span className="data-unit">°C</span></>;
//       default: 
//         return val.toString();
//     }
//   };

//   const getHeaderLabel = (key) => {
//     switch(key) {
//       case 'data2': return 'Instantaneous Flow (m³/hr)';
//       case 'data3': return 'Total Cumulative Flow (m³)';
//       case 'data4': return 'Positive Cumulative Flow (m³)';
//       case 'data5': return 'Negative Cumulative Flow (m³)';
//       case 'data6': return 'Water Temperature (°C)';
//       case 'data1': return 'Data 1';
//       case 'createdAt': return 'Timestamp';
//       case 'updatedAt': return 'Last Updated';
//       default: return key;
//     }
//   };

//   if (loading) return (
//     <div className="sensor-data-container">
//       <div className="loading-container">
//         <motion.div
//           className="loading-spinner"
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//         />
//         <p className="loading-text">Loading sensor data...</p>
//       </div>
//     </div>
//   );

//   if (sensorData.length === 0) return (
//     <div className="sensor-data-container">
//       <p className="no-data-text">No sensor data found for this device.</p>
//     </div>
//   );

//   // Pagination logic
//   const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
//   const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
//   const currentData = filteredData.slice(startIdx, startIdx + ITEMS_PER_PAGE);

//   // Get all unique keys from the data (excluding rawDate)
//   const allKeys = Array.from(
//     new Set(currentData.flatMap(item => Object.keys(item)))
//   ).filter(key => key !== 'rawDate' && key !== '_id');

//   const allSelectedOnPage = currentData.every(item => selectedData.includes(item._id));

//   return (
//     <div className="sensor-data-container">
//       {/* Background effect */}
//       <div className="background-grid">
//         {Array.from({ length: 50 }).map((_, i) => (
//           <motion.div
//             key={`grid-${i}`}
//             className="grid-dot"
//             animate={{
//               opacity: [0.1, 0.3, 0.1],
//             }}
//             transition={{
//               duration: 2 + Math.random() * 3,
//               repeat: Infinity,
//               delay: Math.random() * 2,
//             }}
//           />
//         ))}
//       </div>

//       <motion.div
//         className="content-wrapper"
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//       >
//         <motion.div className="controls-container" variants={itemVariants}>
//           {!showGraph && (
//             <div className="date-range-controls">
//               <motion.div className="date-picker" whileHover={{ scale: 1.02 }}>
//                 <label htmlFor="fromDate">From:</label>
//                 <input
//                   type="date"
//                   id="fromDate"
//                   value={fromDate}
//                   onChange={(e) => setFromDate(e.target.value)}
//                   max={toDate || ""}
//                 />
//               </motion.div>
//               <motion.div className="date-picker" whileHover={{ scale: 1.02 }}>
//                 <label htmlFor="toDate">To:</label>
//                 <input
//                   type="date"
//                   id="toDate"
//                   value={toDate}
//                   onChange={(e) => setToDate(e.target.value)}
//                   min={fromDate || ""}
//                 />
//               </motion.div>
//               <AnimatePresence>
//                 {(fromDate || toDate) && (
//                   <motion.button
//                     onClick={() => {
//                       setFromDate("");
//                       setToDate("");
//                     }}
//                     className="clear-date-btn"
//                     initial={{ opacity: 0, scale: 0.8 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.8 }}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     Clear
//                   </motion.button>
//                 )}
//               </AnimatePresence>
//             </div>
//           )}

//           <div className="action-buttons">
//             <motion.button
//               onClick={downloadCSV}
//               className="download-csv-btn"
//               disabled={filteredData.length === 0}
//               whileHover={{ scale: filteredData.length === 0 ? 1 : 1.05 }}
//               whileTap={{ scale: filteredData.length === 0 ? 1 : 0.95 }}
//             >
//               Download CSV
//             </motion.button>
//             <motion.button
//               onClick={toggleGraph}
//               className="toggle-graph-btn"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               {showGraph ? "Show Table" : "Show Graph"}
//             </motion.button>
//             <motion.div 
//               className="import-btn"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <label htmlFor="file-upload">
//                 <FaFileImport /> Import Data
//               </label>
//               <input
//                 id="file-upload"
//                 type="file"
//                 accept=".csv"
//                 onChange={handleFileUpload}
//                 style={{ display: 'none' }}
//               />
//             </motion.div>
//             <AnimatePresence>
//               {selectedData.length > 0 && (
//                 <motion.button
//                   onClick={handleBulkDelete}
//                   className="delete-bulk-btn"
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.8 }}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <FaTrash /> Delete ({selectedData.length})
//                 </motion.button>
//               )}
//             </AnimatePresence>
//           </div>
//         </motion.div>

//         <motion.h3 variants={itemVariants}>
//           Data for Device: <span className="device-id">{deviceId}</span>
//         </motion.h3>

//         <AnimatePresence>
//           {showGraph ? (
//             <motion.div
//               variants={graphVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//             >
//               <SensorGraph deviceId={deviceId} data={filteredData} />
//             </motion.div>
//           ) : (
//             <>
//               <motion.div className="data-summary" variants={itemVariants}>
//                 Showing {filteredData.length} records
//                 {fromDate || toDate ? " (filtered)" : ""}
//               </motion.div>

//               <motion.div 
//                 className="sensor-data-table-wrapper"
//                 variants={itemVariants}
//               >
//                 <table className="sensor-data-table">
//                   <thead>
//                     <tr>
//                       <motion.th 
//                         className="checkbox-cell" 
//                         whileHover={{ scale: 1.02 }}
//                       >
//                         <div onClick={handleSelectAll} className="select-all-checkbox">
//                           {allSelectedOnPage ? <FaRegCheckSquare /> : <FaRegSquare />}
//                         </div>
//                       </motion.th>
//                       {allKeys.map((key) => (
//                         <motion.th 
//                           key={key} 
//                           className="table-header-cell"
//                           whileHover={{ scale: 1.02 }}
//                         >
//                           {getHeaderLabel(key)}
//                         </motion.th>
//                       ))}
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentData.map((data, rowIndex) => (
//                       <motion.tr 
//                         key={data._id}
//                         className="table-row"
//                         variants={rowVariants}
//                         custom={rowIndex}
//                         initial="hidden"
//                         animate="visible"
//                         whileHover={{ 
//                           backgroundColor: "rgba(50, 205, 50, 0.1)", // Light green hover
//                           transition: { duration: 0.2 }
//                         }}
//                       >
//                         <td className="checkbox-cell">
//                           <input
//                             type="checkbox"
//                             checked={selectedData.includes(data._id)}
//                             onChange={() => handleSelectData(data._id)}
//                           />
//                         </td>
//                         {allKeys.map((key) => (
//                           <motion.td 
//                             key={`${data._id}-${key}`}
//                             className="table-cell"
//                             whileHover={{ scale: 1.01 }}
//                           >
//                             <div className="cell-content">
//                               {editingId === data._id && key !== 'updatedAt' ? (
//                                 key === 'createdAt' ? (
//                                   <input
//                                     type="datetime-local"
//                                     name={key}
//                                     value={editFormData[key] || ""}
//                                     onChange={handleEditFormChange}
//                                     className="edit-input"
//                                   />
//                                 ) : (
//                                   <input
//                                     type={key.includes('data') || key === 'interval' ? "number" : "text"}
//                                     name={key}
//                                     value={editFormData[key] || ""}
//                                     onChange={handleEditFormChange}
//                                     className="edit-input"
//                                     step={key.includes('data') ? "0.001" : "1"}
//                                   />
//                                 )
//                               ) : (
//                                 formatValue(data[key], key)
//                               )}
//                             </div>
//                           </motion.td>
//                         ))}
//                         <td className="actions-cell">
//                           {editingId === data._id ? (
//                             <>
//                               <button 
//                                 onClick={() => handleEditSubmit(data._id)}
//                                 className="action-btn save-btn"
//                               >
//                                 <FaCheck />
//                               </button>
//                               <button 
//                                 onClick={() => setEditingId(null)}
//                                 className="action-btn cancel-btn"
//                               >
//                                 <FaTimes />
//                               </button>
//                             </>
//                           ) : (
//                             <>
//                               <button 
//                                 onClick={() => handleEditClick(data)}
//                                 className="action-btn edit-btn"
//                               >
//                                 <FaEdit />
//                               </button>
//                               <button 
//                                 onClick={() => handleDelete(data._id)}
//                                 className="action-btn delete-btn"
//                               >
//                                 <FaTrash />
//                               </button>
//                             </>
//                           )}
//                         </td>
//                       </motion.tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </motion.div>

//               {filteredData.length > ITEMS_PER_PAGE && (
//                 <motion.div 
//                   className="pagination-controls"
//                   variants={itemVariants}
//                 >
//                   <motion.button
//                     disabled={currentPage === 1}
//                     onClick={() => setCurrentPage((prev) => prev - 1)}
//                     whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
//                     whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
//                   >
//                     ← Previous
//                   </motion.button>
//                   <motion.span
//                     animate={{ scale: [1, 1.05, 1] }}
//                     transition={{ duration: 0.5 }}
//                   >
//                     Page {currentPage} of {totalPages}
//                   </motion.span>
//                   <motion.button
//                     disabled={currentPage === totalPages}
//                     onClick={() => setCurrentPage((prev) => prev + 1)}
//                     whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
//                     whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
//                   >
//                     Next →
//                   </motion.button>
//                 </motion.div>
//               )}
//             </>
//           )}
//         </AnimatePresence>
//       </motion.div>

//       {/* --- IMPORT MODAL --- */}
//       <AnimatePresence>
//         {showImportModal && (
//           <motion.div
//             className="import-modal-overlay"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <motion.div
//               className="import-modal"
//               variants={modalVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//             >
//               <h3>Import Data from File</h3>
//               {uploadProgress ? (
//                 <div className="upload-progress">
//                   {uploadProgress.processed < uploadProgress.total && !isImportCancelled ? (
//                     <>
//                       <h4>Uploading... ({uploadProgress.processed} / {uploadProgress.total})</h4>
//                       <div className="progress-bar-container">
//                         <motion.div
//                           className="progress-bar"
//                           initial={{ width: 0 }}
//                           animate={{ width: `${(uploadProgress.processed / uploadProgress.total) * 100}%` }}
//                           transition={{ duration: 0.5 }}
//                         />
//                       </div>
//                       <div className="progress-stats">
//                         <p className="success">Success: {uploadProgress.success}</p>
//                         <p className="failed">Failed: {uploadProgress.failed}</p>
//                       </div>
//                       <div className="modal-actions">
//                         <button onClick={handleCancelImport} className="cancel-modal-btn">
//                           <FaTimes /> Cancel Upload
//                         </button>
//                       </div>
//                     </>
//                   ) : (
//                     <motion.div 
//                       className="upload-complete"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                     >
//                       <motion.div
//                         className="status-icon"
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
//                       >
//                         {isImportCancelled ? <FaTimes className="cancelled" /> : <FaCheck className="success" />}
//                       </motion.div>
//                       <h4>{isImportCancelled ? 'Upload Cancelled' : 'Upload Complete!'}</h4>
//                       <p>Successfully imported {uploadProgress.success} of {uploadProgress.total} records.</p>
//                       {uploadProgress.failed > 0 && <p className="failed">Failed: {uploadProgress.failed} records could not be imported.</p>}
//                       {isImportCancelled && <p className="info-message">Upload cancelled. Records already processed were saved.</p>}

//                       <button onClick={() => { setShowImportModal(false); setUploadProgress(null); setIsImportCancelled(false); }} className="close-btn">
//                         Close
//                       </button>
//                     </motion.div>
//                   )}
//                 </div>
//               ) : (
//                 <>
//                   <div className="mapping-section">
//                     <h4>Map CSV Columns to Database Fields</h4>
//                     <div className="field-mappings">
//                       {/* Mapping for data fields */}
//                       {['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'interval'].map(field => (
//                         <div className="mapping-item" key={field}>
//                           <label>{field.replace('data', 'Data ')}:</label>
//                           <select
//                             name={field}
//                             value={fieldMapping[field]}
//                             onChange={(e) => handleFieldMappingChange(e, field)}
//                           >
//                             <option value="">-- Select Column --</option>
//                             {fileHeaders.map(header => (
//                               <option key={header} value={header}>{header}</option>
//                             ))}
//                           </select>
//                         </div>
//                       ))}
//                       {/* Timestamp mapping */}
//                       <div className="mapping-item">
//                         <label>Timestamp (Required):</label>
//                         <select
//                           name="timestamp"
//                           value={fieldMapping.timestamp}
//                           onChange={(e) => handleFieldMappingChange(e, 'timestamp')}
//                           required
//                         >
//                           <option value="">-- Select Column --</option>
//                           {fileHeaders.map(header => (
//                             <option key={header} value={header}>{header}</option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                   {fileData.length > 0 && ( // Only show preview if fileData is available
//                     <div className="preview-section">
//                       <h4>Data Preview (First 5 Rows)</h4>
//                       <div className="preview-table-container">
//                         <table className="preview-table">
//                           <thead>
//                             <tr>
//                               {fileHeaders.map((header) => (
//                                 <th key={header}>{header}</th>
//                               ))}
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {fileData.slice(0, 5).map((row, index) => (
//                               <tr key={index}>
//                                 {fileHeaders.map((header) => (
//                                   <td key={`${index}-${header}`}>{row[header]?.toString() || '-'}</td>
//                                 ))}
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   )}
//                   <div className="modal-actions">
//                     <button
//                       onClick={uploadData}
//                       disabled={!fieldMapping.timestamp || fileData.length === 0}
//                       className="upload-modal-btn"
//                     >
//                       {fileData.length === 0 ? "No File Loaded" : "Start Upload"}
//                     </button>
//                     <button onClick={() => setShowImportModal(false)} className="cancel-modal-btn">
//                       Cancel
//                     </button>
//                   </div>
//                 </>
//               )}
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default SingleDeviceSensorData;
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFileImport, FaEdit, FaTrash, FaSpinner, FaCheck, FaTimes, FaRegSquare, FaRegCheckSquare } from "react-icons/fa";
import Papa from "papaparse";
import API from "../services/api";
import SensorGraph from "./DeviceGraphs";
import "../styles/SingleDeviceSensorData.css";

const ITEMS_PER_PAGE = 20;
const BULK_DELETE_LIMIT = 500; // Maximum number of items that can be selected for bulk delete

const SingleDeviceSensorData = ({ deviceId }) => {
  const [sensorData, setSensorData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showGraph, setShowGraph] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [fileData, setFileData] = useState([]);
  const [fileHeaders, setFileHeaders] = useState([]);
  const [dateFormat, setDateFormat] = useState("auto"); // 'auto', 'dd-mm-yyyy', 'mm-dd-yyyy', 'yyyy-mm-dd'
  const [fieldMapping, setFieldMapping] = useState({
    data1: "",
    data2: "",
    data3: "",
    data4: "",
    data5: "",
    data6: "",
    interval: "",
    timestamp: ""
  });
  const [uploadProgress, setUploadProgress] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    data1: "",
    data2: "",
    data3: "",
    data4: "",
    data5: "",
    data6: "",
    interval: "",
    createdAt: ""
  });
  const [selectedData, setSelectedData] = useState([]);
  const [selectAllMode, setSelectAllMode] = useState(false); // For selecting beyond current page
  
  const abortControllerRef = useRef(null);
  const [isImportCancelled, setIsImportCancelled] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
      },
    }),
  };

  const graphVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  // Enhanced date parser with explicit format support
  const parseDateString = (dateStr, format = dateFormat) => {
    if (!dateStr) return null;
    const s = String(dateStr).trim();

    // Helper to create a date object and validate it
    const createValidatedDate = (year, month, day, hour = 0, minute = 0, second = 0) => {
      const d = new Date(year, month - 1, day, hour, minute, second);
      // Validate date components
      if (d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) {
        return d;
      }
      return null;
    };

    let match;

    // Try explicit formats first if specified
    if (format !== 'auto') {
      const separator = s.includes('/') ? '/' : s.includes('-') ? '-' : null;
      if (separator) {
        const parts = s.split(separator);
        if (parts.length >= 3) {
          let day, month, year;
          
          if (format === 'dd-mm-yyyy') {
            [day, month, year] = parts;
          } else if (format === 'mm-dd-yyyy') {
            [month, day, year] = parts;
          } else if (format === 'yyyy-mm-dd') {
            [year, month, day] = parts;
          }
          
          // Extract time if present (format: "dd-mm-yyyy HH:MM:SS")
          let timeParts = [];
          if (parts.length > 3) {
            timeParts = parts.slice(3).join(separator).split(/[\sT:]/).filter(Boolean);
          }
          
          const date = createValidatedDate(
            parseInt(year),
            parseInt(month),
            parseInt(day),
            timeParts[0] ? parseInt(timeParts[0]) : 0,
            timeParts[1] ? parseInt(timeParts[1]) : 0,
            timeParts[2] ? parseInt(timeParts[2]) : 0
          );
          
          if (date) return date;
        }
      }
    }

    // Auto-detect format if explicit parsing failed or format is 'auto'
    // 1. ISO-like format (YYYY-MM-DD or YYYY/MM/DD)
    match = s.match(/^(\d{4})[-/](\d{2})[-/](\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
    if (match) {
      const [_, year, month, day, hour, minute, second] = match;
      const date = createValidatedDate(
        parseInt(year),
        parseInt(month),
        parseInt(day),
        hour ? parseInt(hour) : 0,
        minute ? parseInt(minute) : 0,
        second ? parseInt(second) : 0
      );
      if (date) return date;
    }

    // 2. DD-MM-YYYY or DD/MM/YYYY
    match = s.match(/^(\d{2})[-/](\d{2})[-/](\d{4})(?:[\sT](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
    if (match) {
      const [_, day, month, year, hour, minute, second] = match;
      const date = createValidatedDate(
        parseInt(year),
        parseInt(month),
        parseInt(day),
        hour ? parseInt(hour) : 0,
        minute ? parseInt(minute) : 0,
        second ? parseInt(second) : 0
      );
      if (date) return date;
    }

    // 3. MM-DD-YYYY or MM/DD/YYYY
    match = s.match(/^(\d{2})[-/](\d{2})[-/](\d{4})(?:[\sT](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
    if (match) {
      const [_, month, day, year, hour, minute, second] = match;
      const date = createValidatedDate(
        parseInt(year),
        parseInt(month),
        parseInt(day),
        hour ? parseInt(hour) : 0,
        minute ? parseInt(minute) : 0,
        second ? parseInt(second) : 0
      );
      if (date) return date;
    }

    // Fallback to native Date parsing
    try {
      const d = new Date(s);
      if (!isNaN(d.getTime())) {
        console.warn("Using native Date parser as fallback for:", s);
        return d;
      }
    } catch (e) {
      console.warn("Native Date parsing threw an error for:", s, e);
    }

    console.warn("Failed to parse date string with any known format:", s);
    return null;
  };

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/sensor-data/device/${deviceId}`);
        const formattedData = res.data.map((item, index) => ({
          ...item,
          rawDate: new Date(item.createdAt),
          _id: item._id || `row-${index}-${Date.now()}`,
        }));
        setSensorData(formattedData);
        setFilteredData(formattedData);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSensorData();
  }, [deviceId]);

  useEffect(() => {
    if (!fromDate && !toDate) {
      setFilteredData(sensorData);
      return;
    }

    const from = fromDate ? new Date(fromDate) : null;
    let to = toDate ? new Date(toDate) : null;
    
    if (to) {
        to.setHours(23, 59, 59, 999);
    }
    
    const filtered = sensorData.filter((item) => {
      const itemDate = new Date(item.createdAt);
      const isAfterFrom = !from || itemDate >= from;
      const isBeforeTo = !to || itemDate <= to;
      return isAfterFrom && isBeforeTo;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [fromDate, toDate, sensorData]);

  const downloadCSV = () => {
    if (filteredData.length === 0) return;
    
    const keys = Object.keys(filteredData[0]).filter(key => key !== 'rawDate');
    const csvHeader = keys.map(key => {
      switch(key) {
        case 'data2': return 'Instantaneous Flow (m³/hr)';
        case 'data3': return 'Total Cumulative Flow (m³)';
        case 'data4': return 'Positive Cumulative Flow (m³)';
        case 'data5': return 'Negative Cumulative Flow (m³)';
        case 'data6': return 'Water Temperature (°C)';
        case 'createdAt': return 'Timestamp';
        default: return key;
      }
    }).join(',') + '\n';
    
    const csvRows = filteredData.map(item => {
      return keys.map(key => {
        const value = item[key];
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value);
        }
        return value !== null && value !== undefined ? value.toString() : '';
      }).join(',');
    }).join('\n');
    
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `water-flow-data-${deviceId}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleGraph = () => {
    setShowGraph(prev => !prev);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cleanData = results.data.filter(row => Object.values(row).some(val => val));
        setFileData(cleanData);
        setFileHeaders(Object.keys(cleanData[0] || {}));
        setShowImportModal(true);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
      }
    });
  };

  const handleFieldMappingChange = (e, field) => {
    setFieldMapping({
      ...fieldMapping,
      [field]: e.target.value
    });
  };

  const uploadData = async () => {
    if (!fileData.length) return;

    setIsImportCancelled(false);
    abortControllerRef.current = new AbortController();

    setUploadProgress({
      total: fileData.length,
      processed: 0,
      success: 0,
      failed: 0
    });

    const payloadChunks = [];
    const chunkSize = 50; 

    for (let i = 0; i < fileData.length; i += chunkSize) {
      const chunk = fileData.slice(i, i + chunkSize);
      payloadChunks.push(chunk);
    }

    let successfulUploads = 0;
    let failedUploads = 0;
    let processedCount = 0;

    for (const chunk of payloadChunks) {
      if (isImportCancelled) {
        break;
      }
      
      const uploadPromises = chunk.map(async (row) => {
        if (isImportCancelled) {
          return { status: 'cancelled' };
        }
        
        const payload = {
            device_id: deviceId,
            data1: 0, data2: 0, data3: 0, data4: 0, data5: 0, data6: 0, interval: 0,
        };

        const mapAndParse = (field) => {
            const header = fieldMapping[field];
            return header && row[header] !== undefined
                ? parseFloat(row[header]) || 0
                : 0;
        };

        payload.data1 = mapAndParse('data1');
        payload.data2 = mapAndParse('data2');
        payload.data3 = mapAndParse('data3');
        payload.data4 = mapAndParse('data4');
        payload.data5 = mapAndParse('data5');
        payload.data6 = mapAndParse('data6');
        payload.interval = mapAndParse('interval');

        const parsedDate = fieldMapping.timestamp && row[fieldMapping.timestamp]
            ? parseDateString(row[fieldMapping.timestamp])
            : null;
        
        payload.createdAt = parsedDate ? parsedDate.toISOString() : null;

        try {
            await API.post('/sensor-data', payload, { signal: abortControllerRef.current.signal });
            return { status: 'success' };
        } catch (error) {
            if (error.name === 'AbortError') {
              return { status: 'cancelled' };
            }
            console.error("Error uploading row:", error);
            return { status: 'failed' };
        }
      });

      const results = await Promise.all(uploadPromises);

      successfulUploads += results.filter(res => res.status === 'success').length;
      failedUploads += results.filter(res => res.status === 'failed').length;
      processedCount += chunk.length;

      setUploadProgress(prev => ({
          ...prev,
          processed: processedCount,
          success: successfulUploads,
          failed: failedUploads,
      }));
    }

    if (!isImportCancelled) {
      setTimeout(() => {
        const fetchSensorData = async () => {
          try {
            setLoading(true);
            const res = await API.get(`/sensor-data/device/${deviceId}`);
            const formattedData = res.data.map((item, index) => ({
              ...item,
              rawDate: new Date(item.createdAt),
              _id: item._id || `row-${index}-${Date.now()}`,
            }));
            setSensorData(formattedData);
            setFilteredData(formattedData);
          } catch (error) {
            console.error("Error refreshing sensor data:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchSensorData();
      }, 1000);
    }
  };

  const handleCancelImport = () => {
    setIsImportCancelled(true);
    abortControllerRef.current?.abort();
    setUploadProgress(prev => ({
      ...prev,
      processed: prev.total,
      failed: prev.failed + (prev.total - prev.processed),
    }));
  };

  const handleEditClick = (data) => {
    setEditingId(data._id);
    setEditFormData({
      data1: data.data1 || "0",
      data2: data.data2 || "0",
      data3: data.data3 || "0",
      data4: data.data4 || "0",
      data5: data.data5 || "0",
      data6: data.data6 || "0",
      interval: data.interval || "0",
      createdAt: data.createdAt ? new Date(data.createdAt).toISOString().slice(0, 16) : ""
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleEditSubmit = async (id) => {
    try {
      const payload = {
        device_id: deviceId,
        ...editFormData
      };

      if (payload.createdAt) {
        payload.createdAt = new Date(payload.createdAt).toISOString();
      }

      await API.put(`/sensor-data/${id}`, payload);
      
      setSensorData(prevData =>
        prevData.map(item =>
          item._id === id ? { 
            ...item, 
            ...editFormData,
            rawDate: payload.createdAt ? new Date(payload.createdAt) : item.rawDate
          } : item
        )
      );
      setFilteredData(prevData =>
        prevData.map(item =>
          item._id === id ? { 
            ...item, 
            ...editFormData,
            rawDate: payload.createdAt ? new Date(payload.createdAt) : item.rawDate
          } : item
        )
      );
      
      setEditingId(null);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleSelectData = (id) => {
    setSelectedData(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(itemId => itemId !== id);
      } else if (prevSelected.length < BULK_DELETE_LIMIT) {
        return [...prevSelected, id];
      } else {
        alert(`You can select a maximum of ${BULK_DELETE_LIMIT} items for bulk delete.`);
        return prevSelected;
      }
    });
  };

  const handleSelectAll = () => {
    const currentPageIds = currentData.map(item => item._id);
    const allSelected = currentPageIds.every(id => selectedData.includes(id));
    
    if (allSelected) {
      setSelectedData(prevSelected => prevSelected.filter(id => !currentPageIds.includes(id)));
    } else {
      // Only add items that won't exceed the bulk delete limit
      const availableSlots = BULK_DELETE_LIMIT - selectedData.length;
      if (availableSlots <= 0) {
        alert(`You can select a maximum of ${BULK_DELETE_LIMIT} items for bulk delete.`);
        return;
      }
      
      const itemsToAdd = currentPageIds.slice(0, availableSlots);
      setSelectedData(prevSelected => [...new Set([...prevSelected, ...itemsToAdd])]);
    }
  };

  const handleSelectAllData = () => {
    if (selectAllMode) {
      setSelectedData([]);
      setSelectAllMode(false);
    } else {
      // Select all filtered data up to the bulk delete limit
      const allIds = filteredData.slice(0, BULK_DELETE_LIMIT).map(item => item._id);
      setSelectedData(allIds);
      setSelectAllMode(true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this data entry?")) {
      try {
        await API.delete(`/sensor-data/${id}`);
        setSensorData(prevData => prevData.filter(item => item._id !== id));
        setFilteredData(prevData => prevData.filter(item => item._id !== id));
        setSelectedData(prevSelected => prevSelected.filter(itemId => itemId !== id));
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedData.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedData.length} selected data entries? This action cannot be undone.`)) {
      try {
        // Delete in chunks to avoid overwhelming the server
        const chunkSize = 50;
        for (let i = 0; i < selectedData.length; i += chunkSize) {
          const chunk = selectedData.slice(i, i + chunkSize);
          await Promise.all(chunk.map(id => API.delete(`/sensor-data/${id}`)));
        }
        
        setSensorData(prevData => prevData.filter(item => !selectedData.includes(item._id)));
        setFilteredData(prevData => prevData.filter(item => !selectedData.includes(item._id)));
        setSelectedData([]);
        setSelectAllMode(false);
      } catch (error) {
        console.error("Error deleting data in bulk:", error);
      }
    }
  };

  const formatValue = (val, key) => {
    if (val === null || val === undefined) return "-";
    if (typeof val === "object") {
      return JSON.stringify(val, null, 2);
    }
    
    if (key === 'createdAt' || key === 'updatedAt') {
      return new Date(val).toLocaleString();
    }
    
    switch(key) {
      case 'data2': 
        return <>{parseFloat(val).toFixed(3)} <span className="data-unit">m³/hr</span></>;
      case 'data3': 
        return <>{parseFloat(val).toFixed(3)} <span className="data-unit">m³</span></>;
      case 'data4': 
        return <>{parseFloat(val).toFixed(3)} <span className="data-unit">m³</span></>;
      case 'data5': 
        return <>{parseFloat(val).toFixed(3)} <span className="data-unit">m³</span></>;
      case 'data6': 
        return <>{parseFloat(val).toFixed(2)} <span className="data-unit">°C</span></>;
      default: 
        return val.toString();
    }
  };

  const getHeaderLabel = (key) => {
    switch(key) {
      case 'data2': return 'Instantaneous Flow (m³/hr)';
      case 'data3': return 'Total Cumulative Flow (m³)';
      case 'data4': return 'Positive Cumulative Flow (m³)';
      case 'data5': return 'Negative Cumulative Flow (m³)';
      case 'data6': return 'Water Temperature (°C)';
      case 'data1': return 'Data 1';
      case 'createdAt': return 'Timestamp';
      case 'updatedAt': return 'Last Updated';
      default: return key;
    }
  };

  if (loading) return (
    <div className="sensor-data-container">
      <div className="loading-container">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="loading-text">Loading sensor data...</p>
      </div>
    </div>
  );

  if (sensorData.length === 0) return (
    <div className="sensor-data-container">
      <p className="no-data-text">No sensor data found for this device.</p>
    </div>
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredData.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Get all unique keys from the data (excluding rawDate)
  const allKeys = Array.from(
    new Set(currentData.flatMap(item => Object.keys(item)))
  ).filter(key => key !== 'rawDate' && key !== '_id');

  const allSelectedOnPage = currentData.every(item => selectedData.includes(item._id));

  return (
    <div className="sensor-data-container">
      {/* Background effect */}
      <div className="background-grid">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={`grid-${i}`}
            className="grid-dot"
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        className="content-wrapper"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="controls-container" variants={itemVariants}>
          {!showGraph && (
            <div className="date-range-controls">
              <motion.div className="date-picker" whileHover={{ scale: 1.02 }}>
                <label htmlFor="fromDate">From:</label>
                <input
                  type="date"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  max={toDate || ""}
                />
              </motion.div>
              <motion.div className="date-picker" whileHover={{ scale: 1.02 }}>
                <label htmlFor="toDate">To:</label>
                <input
                  type="date"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  min={fromDate || ""}
                />
              </motion.div>
              <AnimatePresence>
                {(fromDate || toDate) && (
                  <motion.button
                    onClick={() => {
                      setFromDate("");
                      setToDate("");
                    }}
                    className="clear-date-btn"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="action-buttons">
            <motion.button
              onClick={downloadCSV}
              className="download-csv-btn"
              disabled={filteredData.length === 0}
              whileHover={{ scale: filteredData.length === 0 ? 1 : 1.05 }}
              whileTap={{ scale: filteredData.length === 0 ? 1 : 0.95 }}
            >
              Download CSV
            </motion.button>
            <motion.button
              onClick={toggleGraph}
              className="toggle-graph-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showGraph ? "Show Table" : "Show Graph"}
            </motion.button>
            <motion.div 
              className="import-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <label htmlFor="file-upload">
                <FaFileImport /> Import Data
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </motion.div>
            <AnimatePresence>
              {selectedData.length > 0 && (
                <motion.button
                  onClick={handleBulkDelete}
                  className="delete-bulk-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTrash /> Delete ({selectedData.length})
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.h3 variants={itemVariants}>
          Data for Device: <span className="device-id">{deviceId}</span>
        </motion.h3>

        <AnimatePresence>
          {showGraph ? (
            <motion.div
              variants={graphVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <SensorGraph deviceId={deviceId} data={filteredData} />
            </motion.div>
          ) : (
            <>
              <motion.div className="data-summary" variants={itemVariants}>
                Showing {filteredData.length} records
                {fromDate || toDate ? " (filtered)" : ""}
                {selectedData.length > 0 && (
                  <span className="selected-count">
                    ({selectedData.length} selected)
                  </span>
                )}
                {selectAllMode && (
                  <span className="select-all-mode">
                    (All {Math.min(filteredData.length, BULK_DELETE_LIMIT)} items selected)
                  </span>
                )}
              </motion.div>

              {selectedData.length > 0 && (
                <motion.div 
                  className="bulk-actions"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <button 
                    onClick={handleSelectAllData}
                    className="select-all-btn"
                  >
                    {selectAllMode ? "Deselect All" : "Select All (Up to 500)"}
                  </button>
                </motion.div>
              )}

              <motion.div 
                className="sensor-data-table-wrapper"
                variants={itemVariants}
              >
                <table className="sensor-data-table">
                  <thead>
                    <tr>
                      <motion.th 
                        className="checkbox-cell" 
                        whileHover={{ scale: 1.02 }}
                      >
                        <div onClick={handleSelectAll} className="select-all-checkbox">
                          {allSelectedOnPage ? <FaRegCheckSquare /> : <FaRegSquare />}
                        </div>
                      </motion.th>
                      {allKeys.map((key) => (
                        <motion.th 
                          key={key} 
                          className="table-header-cell"
                          whileHover={{ scale: 1.02 }}
                        >
                          {getHeaderLabel(key)}
                        </motion.th>
                      ))}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((data, rowIndex) => (
                      <motion.tr 
                        key={data._id}
                        className="table-row"
                        variants={rowVariants}
                        custom={rowIndex}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ 
                          backgroundColor: "rgba(50, 205, 50, 0.1)",
                          transition: { duration: 0.2 }
                        }}
                      >
                        <td className="checkbox-cell">
                          <input
                            type="checkbox"
                            checked={selectedData.includes(data._id)}
                            onChange={() => handleSelectData(data._id)}
                            disabled={selectedData.length >= BULK_DELETE_LIMIT && !selectedData.includes(data._id)}
                          />
                        </td>
                        {allKeys.map((key) => (
                          <motion.td 
                            key={`${data._id}-${key}`}
                            className="table-cell"
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="cell-content">
                              {editingId === data._id && key !== 'updatedAt' ? (
                                key === 'createdAt' ? (
                                  <input
                                    type="datetime-local"
                                    name={key}
                                    value={editFormData[key] || ""}
                                    onChange={handleEditFormChange}
                                    className="edit-input"
                                  />
                                ) : (
                                  <input
                                    type={key.includes('data') || key === 'interval' ? "number" : "text"}
                                    name={key}
                                    value={editFormData[key] || ""}
                                    onChange={handleEditFormChange}
                                    className="edit-input"
                                    step={key.includes('data') ? "0.001" : "1"}
                                  />
                                )
                              ) : (
                                formatValue(data[key], key)
                              )}
                            </div>
                          </motion.td>
                        ))}
                        <td className="actions-cell">
                          {editingId === data._id ? (
                            <>
                              <button 
                                onClick={() => handleEditSubmit(data._id)}
                                className="action-btn save-btn"
                              >
                                <FaCheck />
                              </button>
                              <button 
                                onClick={() => setEditingId(null)}
                                className="action-btn cancel-btn"
                              >
                                <FaTimes />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleEditClick(data)}
                                className="action-btn edit-btn"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => handleDelete(data._id)}
                                className="action-btn delete-btn"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>

              {filteredData.length > ITEMS_PER_PAGE && (
                <motion.div 
                  className="pagination-controls"
                  variants={itemVariants}
                >
                  <motion.button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                    whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                  >
                    ← Previous
                  </motion.button>
                  <motion.span
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    Page {currentPage} of {totalPages}
                  </motion.span>
                  <motion.button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                    whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
                  >
                    Next →
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* --- IMPORT MODAL --- */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div
            className="import-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="import-modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h3>Import Data from File</h3>
              {uploadProgress ? (
                <div className="upload-progress">
                  {uploadProgress.processed < uploadProgress.total && !isImportCancelled ? (
                    <>
                      <h4>Uploading... ({uploadProgress.processed} / {uploadProgress.total})</h4>
                      <div className="progress-bar-container">
                        <motion.div
                          className="progress-bar"
                          initial={{ width: 0 }}
                          animate={{ width: `${(uploadProgress.processed / uploadProgress.total) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="progress-stats">
                        <p className="success">Success: {uploadProgress.success}</p>
                        <p className="failed">Failed: {uploadProgress.failed}</p>
                      </div>
                      <div className="modal-actions">
                        <button onClick={handleCancelImport} className="cancel-modal-btn">
                          <FaTimes /> Cancel Upload
                        </button>
                      </div>
                    </>
                  ) : (
                    <motion.div 
                      className="upload-complete"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="status-icon"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {isImportCancelled ? <FaTimes className="cancelled" /> : <FaCheck className="success" />}
                      </motion.div>
                      <h4>{isImportCancelled ? 'Upload Cancelled' : 'Upload Complete!'}</h4>
                      <p>Successfully imported {uploadProgress.success} of {uploadProgress.total} records.</p>
                      {uploadProgress.failed > 0 && <p className="failed">Failed: {uploadProgress.failed} records could not be imported.</p>}
                      {isImportCancelled && <p className="info-message">Upload cancelled. Records already processed were saved.</p>}

                      <button onClick={() => { setShowImportModal(false); setUploadProgress(null); setIsImportCancelled(false); }} className="close-btn">
                        Close
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <>
                  <div className="mapping-section">
                    <h4>Map CSV Columns to Database Fields</h4>
                    <div className="date-format-selector">
                      <label>Date Format in CSV:</label>
                      <select
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                      >
                        <option value="auto">Auto-detect</option>
                        <option value="dd-mm-yyyy">DD-MM-YYYY or DD/MM/YYYY</option>
                        <option value="mm-dd-yyyy">MM-DD-YYYY or MM/DD/YYYY</option>
                        <option value="yyyy-mm-dd">YYYY-MM-DD or YYYY/MM/DD</option>
                      </select>
                    </div>
                    <div className="field-mappings">
                      {['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'interval'].map(field => (
                        <div className="mapping-item" key={field}>
                          <label>{field.replace('data', 'Data ')}:</label>
                          <select
                            name={field}
                            value={fieldMapping[field]}
                            onChange={(e) => handleFieldMappingChange(e, field)}
                          >
                            <option value="">-- Select Column --</option>
                            {fileHeaders.map(header => (
                              <option key={header} value={header}>{header}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                      <div className="mapping-item">
                        <label>Timestamp (Required):</label>
                        <select
                          name="timestamp"
                          value={fieldMapping.timestamp}
                          onChange={(e) => handleFieldMappingChange(e, 'timestamp')}
                          required
                        >
                          <option value="">-- Select Column --</option>
                          {fileHeaders.map(header => (
                            <option key={header} value={header}>{header}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  {fileData.length > 0 && (
                    <div className="preview-section">
                      <h4>Data Preview (First 5 Rows)</h4>
                      <div className="preview-table-container">
                        <table className="preview-table">
                          <thead>
                            <tr>
                              {fileHeaders.map((header) => (
                                <th key={header}>{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {fileData.slice(0, 5).map((row, index) => (
                              <tr key={index}>
                                {fileHeaders.map((header) => (
                                  <td key={`${index}-${header}`}>{row[header]?.toString() || '-'}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  <div className="modal-actions">
                    <button
                      onClick={uploadData}
                      disabled={!fieldMapping.timestamp || fileData.length === 0}
                      className="upload-modal-btn"
                    >
                      {fileData.length === 0 ? "No File Loaded" : "Start Upload"}
                    </button>
                    <button onClick={() => setShowImportModal(false)} className="cancel-modal-btn">
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SingleDeviceSensorData;