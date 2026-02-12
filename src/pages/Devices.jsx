// import { useEffect, useState, useRef } from "react";
// import API from "../services/api";
// import { Link } from "react-router-dom";
// import "../styles/Devices.css";
// import { motion, AnimatePresence } from "framer-motion";

// const Devices = () => {
//   const [devices, setDevices] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);
//   const itemsPerPage = 20;
//   const containerRef = useRef(null);

//   const columnMapping = {
//     device_id: "Device ID",
//     device_name: "Device Name",
//     data1: "Data 1",
//     data2: "Instantaneous Flow",
//     data3: "Total Cumulative Flow",
//     data4: "Positive Cumulative Flow",
//     data5: "Negative Cumulative Flow",
//     data6: "Water Supply Temperature",
//     interval: "Interval",
//     createdAt: "Created At"
//   };

//   // Water droplet animation effect
//   useEffect(() => {
//     const createDroplets = () => {
//       const container = containerRef.current;
//       if (!container) return;

//       const dropletCount = Math.floor(window.innerWidth / 30);

//       for (let i = 0; i < dropletCount; i++) {
//         const droplet = document.createElement('div');
//         droplet.classList.add('water-droplet');

//         const size = Math.random() * 8 + 4;
//         const left = Math.random() * 100;
//         const delay = Math.random() * 5;
//         const duration = Math.random() * 15 + 10;

//         droplet.style.width = `${size}px`;
//         droplet.style.height = `${size}px`;
//         droplet.style.left = `${left}vw`;
//         droplet.style.animationDelay = `${delay}s`;
//         droplet.style.animationDuration = `${duration}s`;

//         container.appendChild(droplet);
//       }
//     };

//     createDroplets();
//     return () => {
//       const droplets = containerRef.current?.querySelectorAll('.water-droplet');
//       droplets?.forEach(d => d.remove());
//     };
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const [sensorRes, userRes] = await Promise.all([
//           API.get("/sensor-data"),
//           API.get("/users")
//         ]);

//         const sensorData = sensorRes.data.data || [];
//         const users = userRes.data || [];

//         // Map assigned devices
//         const assignedMap = new Map();
//         users.forEach(user => {
//           (user.devices || []).forEach(dev => {
//             assignedMap.set(dev.device_id, dev.device_name);
//           });
//         });

//         // Keep latest data per device_id
//         const latestMap = new Map();
//         sensorData.forEach(entry => {
//           const existing = latestMap.get(entry.device_id);
//           if (!existing || new Date(entry.createdAt) > new Date(existing.createdAt)) {
//             latestMap.set(entry.device_id, entry);
//           }
//         });

//         // Merge with device_name
//         const merged = Array.from(latestMap.values()).map(entry => ({
//           ...entry,
//           device_name: assignedMap.get(entry.device_id) || "NA"
//         }));

//         setDevices(merged);
//       } catch (err) {
//         console.error("Error loading devices:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const filteredDevices = devices.filter(device =>
//     device.device_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     device.device_name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentPageDevices = filteredDevices.slice(startIndex, startIndex + itemsPerPage);

//   const tableHeaders = currentPageDevices.length > 0
//     ? Object.keys(currentPageDevices[0]).filter(key => columnMapping[key])
//     : Object.keys(columnMapping);

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         when: "beforeChildren"
//       }
//     }
//   };

//   const rowVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.3 }
//     }
//   };

//   const fadeIn = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { duration: 0.5 } }
//   };

//   return (
//     <div className="devices-container" ref={containerRef}>
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={fadeIn}
//         className="devices-content"
//       >
//         <h2 className="devices-title">Flow Meter Devices</h2>

//         <motion.div
//           variants={fadeIn}
//           className="search-container"
//         >
//           <input
//             type="text"
//             placeholder="Search devices..."
//             value={searchTerm}
//             onChange={e => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="devices-search-input"
//           />
//           <div className="search-icon">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//               <circle cx="11" cy="11" r="8" strokeWidth="2" />
//               <path d="M21 21l-4.35-4.35" strokeWidth="2" />
//             </svg>
//           </div>
//         </motion.div>

//         {isLoading ? (
//           <motion.div
//             variants={fadeIn}
//             className="loading-animation"
//           >
//             <div className="flow-spinner">
//               <div className="flow-spinner-dot"></div>
//               <div className="flow-spinner-dot"></div>
//               <div className="flow-spinner-dot"></div>
//             </div>
//             <p>Loading devices...</p>
//           </motion.div>
//         ) : (
//           <>
//             <div className="devices-table-wrapper">
//               <motion.table
//                 variants={containerVariants}
//                 initial="hidden"
//                 animate="visible"
//                 className="devices-table"
//               >
//                 <thead>
//                   <motion.tr variants={fadeIn}>
//                     {tableHeaders.map(header => (
//                       <th key={header} className="devices-table-header">
//                         {columnMapping[header]}
//                       </th>
//                     ))}
//                   </motion.tr>
//                 </thead>
//                 <tbody>
//                   <AnimatePresence>
//                     {currentPageDevices.map(device => (
//                       <motion.tr
//                         key={device.device_id}
//                         variants={rowVariants}
//                         initial="hidden"
//                         animate="visible"
//                         exit="hidden"
//                         whileHover={{ scale: 1.01 }}
//                         transition={{ type: "spring", stiffness: 300 }}
//                         className="device-row"
//                       >
//                         {tableHeaders.map(col => (
//                           <td key={col} className="devices-table-cell">
//                             {col === "device_id" ? (
//                               <Link
//                                 to={`/device/${device[col]}`}
//                                 className="devices-device-link"
//                               >
//                                 <span className="device-id-badge">
//                                   {device[col]}
//                                 </span>
//                               </Link>
//                             ) : col === "createdAt" ? (
//                               new Date(device[col]).toLocaleString()
//                             ) : col === "data2" || col === "data3" || col === "data4" || col === "data5" ? (
//                               <div className="flow-value-container">
//                                 <span className="flow-value">{device[col] ?? "-"}</span>
//                                 <span className="flow-unit">
//                                   {col === "data2" ? "m³/h" : "m³"}
//                                 </span>
//                               </div>
//                             ) : col === "data6" ? (
//                               <div className="temp-value-container">
//                                 <span className="temp-value">{device[col] ?? "-"}</span>
//                                 <span className="temp-unit">°C</span>
//                               </div>
//                             ) : (
//                               device[col] ?? "-"
//                             )}
//                           </td>
//                         ))}
//                       </motion.tr>
//                     ))}
//                   </AnimatePresence>

//                   {currentPageDevices.length === 0 && (
//                     <motion.tr variants={fadeIn}>
//                       <td colSpan={tableHeaders.length} className="devices-no-results">
//                         <div className="no-devices-found">
//                           <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                             <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeWidth="2" />
//                             <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2" />
//                             <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" />
//                           </svg>
//                           <p>No devices found matching your search</p>
//                         </div>
//                       </td>
//                     </motion.tr>
//                   )}
//                 </tbody>
//               </motion.table>
//             </div>

//             <motion.div
//               variants={fadeIn}
//               className="devices-pagination"
//             >
//               <button
//                 onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="devices-btn-pagination"
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                   <polyline points="15 18 9 12 15 6" strokeWidth="2" />
//                 </svg>
//                 Prev
//               </button>
//               <span className="devices-page-info">
//                 Page {currentPage} of {totalPages || 1}
//               </span>
//               <button
//                 onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
//                 disabled={currentPage === totalPages || totalPages === 0}
//                 className="devices-btn-pagination"
//                 whileTap={{ scale: 0.95 }}
//               >
//                 Next
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                   <polyline points="9 18 15 12 9 6" strokeWidth="2" />
//                 </svg>
//               </button>
//             </motion.div>
//           </>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default Devices;
import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import "../styles/Devices.css";
import { motion, AnimatePresence } from "framer-motion";

const Devices = () => {
  const [devices, setDevices] = useState([]);
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
    longitude: "Longitude"
  };

  // Water droplet animation effect
  useEffect(() => {
    const createDroplets = () => {
      const container = containerRef.current;
      if (!container) return;

      const dropletCount = Math.floor(window.innerWidth / 30);

      for (let i = 0; i < dropletCount; i++) {
        const droplet = document.createElement('div');
        droplet.classList.add('water-droplet');

        const size = Math.random() * 8 + 4;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 15 + 10;

        droplet.style.width = `${size}px`;
        droplet.style.height = `${size}px`;
        droplet.style.left = `${left}vw`;
        droplet.style.animationDelay = `${delay}s`;
        droplet.style.animationDuration = `${duration}s`;

        container.appendChild(droplet);
      }
    };

    createDroplets();
    return () => {
      const droplets = containerRef.current?.querySelectorAll('.water-droplet');
      droplets?.forEach(d => d.remove());
    };
  }, []);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await API.get("/sensor-data/devices/all");
        const devicesData = response.data.devices || [];
        
        // Clean and format device data
        const formattedDevices = devicesData.map(device => ({
          device_id: device.device_id || "N/A",
          device_name: device.device_name || "N/A",
          device_location: device.device_location || "N/A",
          device_site_name: device.device_site_name || "N/A",
          latitude: device.latitude === "NA" || !device.latitude ? "N/A" : device.latitude,
          longitude: device.longitude === "NA" || !device.longitude ? "N/A" : device.longitude,
          _id: device._id
        }));

        setDevices(formattedDevices);
      } catch (err) {
        console.error("Error loading devices:", err);
        setError("Failed to load devices. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    // Add timeout for request
    const timeoutId = setTimeout(() => {
      fetchDevices();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  const filteredDevices = devices.filter(device =>
    device.device_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.device_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.device_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.device_site_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageDevices = filteredDevices.slice(startIndex, startIndex + itemsPerPage);

  const tableHeaders = [
    'device_id', 
    'device_name', 
    'device_location', 
    'device_site_name', 
    'latitude', 
    'longitude'
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const formatCoordinate = (coord) => {
    if (!coord || coord === "N/A") return "N/A";
    // Trim and clean coordinate values
    return coord.toString().trim();
  };

  return (
    <div className="devices-container" ref={containerRef}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="devices-content"
      >
        <h2 className="devices-title">Flow Meter Devices</h2>

        <motion.div
          variants={fadeIn}
          className="search-container"
        >
          <input
            type="text"
            placeholder="Search by Device ID, Name, Location, or Site..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="devices-search-input"
          />
          <div className="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" strokeWidth="2" />
            </svg>
          </div>
        </motion.div>

        {error && (
          <motion.div
            variants={fadeIn}
            className="error-message"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeWidth="2" />
              <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2" />
              <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" />
            </svg>
            <p>{error}</p>
          </motion.div>
        )}

        {isLoading ? (
          <motion.div
            variants={fadeIn}
            className="loading-animation"
          >
            <div className="flow-spinner">
              <div className="flow-spinner-dot"></div>
              <div className="flow-spinner-dot"></div>
              <div className="flow-spinner-dot"></div>
            </div>
            <p>Loading devices...</p>
          </motion.div>
        ) : (
          <>
            <div className="devices-summary">
              <motion.p variants={fadeIn}>
                Showing {currentPageDevices.length} of {filteredDevices.length} devices
                {searchTerm && ` for "${searchTerm}"`}
              </motion.p>
            </div>

            <div className="devices-table-wrapper">
              <motion.table
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="devices-table"
              >
                <thead>
                  <motion.tr variants={fadeIn}>
                    {tableHeaders.map(header => (
                      <th key={header} className="devices-table-header">
                        {columnMapping[header]}
                      </th>
                    ))}
                  </motion.tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {currentPageDevices.map(device => (
                      <motion.tr
                        key={device._id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="device-row"
                      >
                        {tableHeaders.map(col => (
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
                            ) : (
                              <span className="device-info-text">
                                {device[col]}
                              </span>
                            )}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </AnimatePresence>

                  {currentPageDevices.length === 0 && (
                    <motion.tr variants={fadeIn}>
                      <td colSpan={tableHeaders.length} className="devices-no-results">
                        <div className="no-devices-found">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeWidth="2" />
                            <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2" />
                            <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" />
                          </svg>
                          <p>No devices found matching your search</p>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </tbody>
              </motion.table>
            </div>

            {totalPages > 1 && (
              <motion.div
                variants={fadeIn}
                className="devices-pagination"
              >
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="devices-btn-pagination"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="15 18 9 12 15 6" strokeWidth="2" />
                  </svg>
                  Prev
                </button>
                <span className="devices-page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="devices-btn-pagination"
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="9 18 15 12 9 6" strokeWidth="2" />
                  </svg>
                </button>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Devices;