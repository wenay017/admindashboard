
// import React, { useEffect, useState, useRef } from "react";
// import API from "../services/api";
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from "recharts";
// import { MapContainer, TileLayer, Marker, Popup, Tooltip as MapTooltip } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import "../styles/dashboard.css";

// // Fix for default markers in react-leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// // Custom icons for online/offline devices with better design
// const createCustomIcon = (status) => {
//   const color = status === 'online' ? '#10b981' : '#ef4444';
//   const symbol = status === 'online' ? '🟢' : '🔴';
  
//   return new L.DivIcon({
//     html: `
//       <div class="custom-marker ${status}">
//         <div class="marker-pulse"></div>
//         <div class="marker-icon">${symbol}</div>
//       </div>
//     `,
//     className: 'custom-div-icon',
//     iconSize: [40, 40],
//     iconAnchor: [20, 40],
//   });
// };

// const onlineIcon = createCustomIcon('online');
// const offlineIcon = createCustomIcon('offline');

// const lineColors = ["#00d4ff", "#0066ff", "#6ee7b7", "#3b82f6", "#8b5cf6", "#ec4899"];

// const Dashboard = () => {
//   const [sensorData, setSensorData] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [uniqueDevices, setUniqueDevices] = useState([]);
//   const [deviceStatus, setDeviceStatus] = useState({});
//   const [deviceLocations, setDeviceLocations] = useState({});
//   const [userGrowth, setUserGrowth] = useState(0);
//   const [showOnlineDevices, setShowOnlineDevices] = useState(false);
//   const [showOfflineDevices, setShowOfflineDevices] = useState(false);
//   const [allDevices, setAllDevices] = useState([]);
//   const dashboardRef = useRef(null);

//   // Fetch all devices with coordinates from the API
//   const fetchAllDevices = async () => {
//     try {
//       const response = await fetch('http://13.201.156.32:5000/api/sensor-data/devices/all');
//       const data = await response.json();
//       setAllDevices(data.devices || []);
//       return data.devices || [];
//     } catch (error) {
//       console.error("Error fetching devices:", error);
//       return [];
//     }
//   };

//   // Animation effects (water droplets, pipes, bubbles)
//   useEffect(() => {
//     const createDroplets = () => {
//       const container = dashboardRef.current;
//       if (!container) return;
      
//       const dropletCount = Math.floor(window.innerWidth / 20);
      
//       for (let i = 0; i < dropletCount; i++) {
//         const droplet = document.createElement('div');
//         droplet.classList.add('water-droplet');
        
//         const size = Math.random() * 10 + 5;
//         const left = Math.random() * 100;
//         const delay = Math.random() * 5;
//         const duration = Math.random() * 10 + 10;
        
//         droplet.style.width = `${size}px`;
//         droplet.style.height = `${size}px`;
//         droplet.style.left = `${left}vw`;
//         droplet.style.animationDelay = `${delay}s`;
//         droplet.style.animationDuration = `${duration}s`;
        
//         container.appendChild(droplet);
//       }
//     };

//     const createPipes = () => {
//       const container = dashboardRef.current;
//       if (!container) return;
      
//       const pipeCount = 3;
      
//       for (let i = 0; i < pipeCount; i++) {
//         const pipe = document.createElement('div');
//         pipe.classList.add('pipe-animation');
        
//         const top = Math.random() * 100;
//         const width = Math.random() * 200 + 100;
//         const delay = Math.random() * 3;
//         const duration = Math.random() * 20 + 10;
        
//         pipe.style.top = `${top}vh`;
//         pipe.style.width = `${width}px`;
//         pipe.style.animationDelay = `${delay}s`;
//         pipe.style.animationDuration = `${duration}s`;
        
//         container.appendChild(pipe);
//       }
//     };

//     const createBubbles = () => {
//       const container = dashboardRef.current;
//       if (!container) return;
      
//       const bubbleCount = Math.floor(window.innerWidth / 15);
      
//       for (let i = 0; i < bubbleCount; i++) {
//         const bubble = document.createElement('div');
//         bubble.classList.add('bubble');
        
//         const size = Math.random() * 15 + 5;
//         const left = Math.random() * 100;
//         const top = Math.random() * 100;
//         const delay = Math.random() * 5;
//         const duration = Math.random() * 10 + 5;
        
//         bubble.style.width = `${size}px`;
//         bubble.style.height = `${size}px`;
//         bubble.style.left = `${left}vw`;
//         bubble.style.top = `${top}vh`;
//         bubble.style.animationDelay = `${delay}s`;
//         bubble.style.animationDuration = `${duration}s`;
        
//         container.appendChild(bubble);
//       }
//     };

//     const initAnimations = () => {
//       const existing = dashboardRef.current.querySelectorAll('.water-droplet, .pipe-animation, .bubble');
//       existing.forEach(el => el.remove());
//       createDroplets();
//       createPipes();
//       createBubbles();
//     };

//     initAnimations();
//     window.addEventListener('resize', initAnimations);
//     return () => window.removeEventListener('resize', initAnimations);
//   }, []);

//   // Data fetching and processing
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         // Fetch all devices first
//         const devicesFromApi = await fetchAllDevices();
        
//         const [sensorRes, userRes] = await Promise.all([
//           API.get("/sensor-data"),
//           API.get("/users"),
//         ]);

//         const sensor = sensorRes.data.data || [];
//         const userList = userRes.data || [];
//         const uniqueDeviceList = [...new Set(sensor.map((item) => item.device_id))];

//         // Calculate device status (online/offline) and locations
//         const statusMap = {};
//         const locationMap = {};
        
//         // Get today's date for daily online status check
//         const today = new Date();
//         const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
//         uniqueDeviceList.forEach(deviceId => {
//           const deviceData = sensor.filter(d => d.device_id === deviceId);
          
//           // Check if device has any data from today - if yes, it's online
//           const hasDataToday = deviceData.some(item => {
//             const itemDate = new Date(item.createdAt);
//             return itemDate >= todayStart;
//           });
          
//           // If device has any data from today, mark as online, otherwise offline
//           statusMap[deviceId] = hasDataToday ? "online" : "offline";
          
//           // Find device in the API response to get coordinates
//           const deviceFromApi = devicesFromApi.find(device => device.device_id === deviceId);
          
//           if (deviceFromApi) {
//             const lat = deviceFromApi.latitude;
//             const lng = deviceFromApi.longitude;
            
//             // Check if coordinates are valid and not "NA"
//             if (lat && lng && lat !== 'NA' && lng !== 'NA' && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
//               const parsedLat = parseFloat(lat);
//               const parsedLng = parseFloat(lng);
              
//               // Only include valid geographic coordinates
//               if (parsedLat >= -90 && parsedLat <= 90 && parsedLng >= -180 && parsedLng <= 180) {
//                 locationMap[deviceId] = {
//                   lat: parsedLat,
//                   lng: parsedLng,
//                   device_location: deviceFromApi.device_location || 'Unknown Location',
//                   device_site_name: deviceFromApi.device_site_name || 'Unknown Site',
//                   device_name: deviceFromApi.device_name || 'Unknown Device'
//                 };
//               }
//             }
//           }
//         });

//         // Calculate user growth percentage (monthly)
//         const currentMonth = new Date().getMonth();
//         const currentYear = new Date().getFullYear();
//         const prevMonthUsers = userList.filter(user => {
//           const userDate = new Date(user.createdAt);
//           return userDate.getMonth() === (currentMonth === 0 ? 11 : currentMonth - 1) && 
//                  userDate.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear);
//         }).length;
        
//         const growthPercentage = prevMonthUsers > 0 
//           ? Math.round(((userList.length - prevMonthUsers) / prevMonthUsers) * 100)
//           : userList.length > 0 ? 100 : 0;

//         setSensorData(sensor);
//         setUsers(userList);
//         setUniqueDevices(uniqueDeviceList);
//         setDeviceStatus(statusMap);
//         setDeviceLocations(locationMap);
//         setUserGrowth(growthPercentage);

//       } catch (error) {
//         console.error("Error loading dashboard data:", error);
//       }
//     };

//     fetchDashboardData();
//     // Poll for new data every 30 seconds
//     const interval = setInterval(fetchDashboardData, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   // Data transformations for rendering
//   const recentSensorData = [...sensorData]
//     .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
//     .slice(-10);

//   const timeDeviceMap = {};
//   recentSensorData.forEach(item => {
//     const timeKey = `${new Date(item.createdAt).toLocaleDateString()} ${new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
//     timeDeviceMap[timeKey] = item.device_id;
//   });

//   const lineChartData = recentSensorData.map((item) => ({
//     time: `${new Date(item.createdAt).toLocaleDateString()} ${new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
//     ...(item.data1 !== undefined && { data1: item.data1 }),
//     ...(item.data2 !== undefined && { data2: item.data2 }),
//     ...(item.data3 !== undefined && { data3: item.data3 }),
//     ...(item.data4 !== undefined && { data4: item.data4 }),
//     ...(item.data5 !== undefined && { data5: item.data5 }),
//     ...(item.data6 !== undefined && { data6: item.data6 }),
//     device_id: item.device_id
//   }));

//   // Count online and offline devices
//   const onlineDevices = Object.entries(deviceStatus)
//     .filter(([_, status]) => status === "online")
//     .map(([deviceId]) => deviceId);
  
//   const offlineDevices = Object.entries(deviceStatus)
//     .filter(([_, status]) => status === "offline")
//     .map(([deviceId]) => deviceId);

//   const onlineDevicesCount = onlineDevices.length;
//   const offlineDevicesCount = offlineDevices.length;
//   const totalDevicesCount = uniqueDevices.length;

//   // Get devices with valid locations from the API data
//   const devicesWithLocations = Object.entries(deviceLocations)
//     .filter(([deviceId, location]) => {
//       // Ensure we have valid coordinates and the device exists
//       return location && 
//              location.lat && 
//              location.lng && 
//              location.lat !== 'NA' && 
//              location.lng !== 'NA' &&
//              !isNaN(location.lat) && 
//              !isNaN(location.lng) &&
//              uniqueDevices.includes(deviceId);
//     })
//     .map(([deviceId, location]) => ({
//       deviceId,
//       ...location,
//       status: deviceStatus[deviceId] || 'offline'
//     }));

//   // Calculate map center based on device locations or use default
//   const calculateMapCenter = () => {
//     if (devicesWithLocations.length === 0) {
//       return [20.5937, 78.9629]; // Default to India center
//     }
    
//     const validLocations = devicesWithLocations.filter(device => 
//       !isNaN(device.lat) && !isNaN(device.lng)
//     );
    
//     if (validLocations.length === 0) {
//       return [20.5937, 78.9629]; // Default to India center
//     }
    
//     const avgLat = validLocations.reduce((sum, device) => sum + device.lat, 0) / validLocations.length;
//     const avgLng = validLocations.reduce((sum, device) => sum + device.lng, 0) / validLocations.length;
    
//     return [avgLat, avgLng];
//   };

//   const mapCenter = calculateMapCenter();

//   // Custom Line Chart Tooltip Component
//   const LineTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="custom-tooltip">
//           <p style={{ 
//             fontWeight: 'bold',
//             color: '#00d4ff',
//             borderBottom: '1px solid rgba(0, 212, 255, 0.3)',
//             paddingBottom: '5px',
//             marginBottom: '10px'
//           }}>
//             {label}
//           </p>
//           <p style={{ color: '#94a3b8', marginBottom: '15px' }}>
//             Device: {timeDeviceMap[label] || 'Unknown'}
//           </p>
//           {payload.map((entry, index) => (
//             <div key={`item-${index}`} style={{ 
//               display: 'flex',
//               alignItems: 'center',
//               margin: '5px 0'
//             }}>
//               <div style={{
//                 width: '10px',
//                 height: '10px',
//                 backgroundColor: entry.color,
//                 borderRadius: '2px',
//                 marginRight: '8px'
//               }} />
//               <span style={{ color: entry.color }}>
//                 {entry.name}: <strong>{entry.value}</strong>
//               </span>
//             </div>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="dashboard-container" ref={dashboardRef}>
//       <div className="dashboard-content">
//         <div className="dashboard-header">
//           <h2 className="dashboard-title">FLOW METER ANALYTICS</h2>
//           {/* <div className="device-summary">
//             Total Devices: {totalDevicesCount} | 
//             With Locations: {devicesWithLocations.length} | 
//             Online: {onlineDevicesCount} | 
//             Offline: {offlineDevicesCount} */}
//           {/* </div> */}
//         </div>

//         {/* Statistics Boxes */}
//         <div className="dashboard-stats">
//           <div className="stat-box">
//             <div className="stat-icon">🌊</div>
//             <p className="stat-label">Sensor Entries</p>
//             <p className="stat-value">{sensorData.length}</p>
//             <p className="stat-unit">readings</p>
//           </div>
          
//           <div className="stat-box" onClick={() => setShowOnlineDevices(true)}>
//             <div className="stat-icon">⚡</div>
//             <p className="stat-label">Online Devices</p>
//             <p className="stat-value">{onlineDevicesCount}</p>
//             <div className="valve-status valve-open">
//               Click to view
//             </div>
//           </div>
          
//           <div className="stat-box" onClick={() => setShowOfflineDevices(true)}>
//             <div className="stat-icon">🔧</div>
//             <p className="stat-label">Offline Devices</p>
//             <p className="stat-value">{offlineDevicesCount}</p>
//             <div className="valve-status valve-closed">
//               Click to view
//             </div>
//           </div>
          
//           <div className="stat-box">
//             <div className="stat-icon">👨‍💼</div>
//             <p className="stat-label">System Users</p>
//             <p className="stat-value">{users.length}</p>
//             <p className="stat-trend" style={{ color: userGrowth >= 0 ? '#6ee7b7' : '#ef4444' }}>
//               {userGrowth >= 0 ? '📈' : '📉'} {Math.abs(userGrowth)}%
//             </p>
//           </div>
//         </div>

//         {/* Online Devices Popup */}
//         {showOnlineDevices && (
//           <div className="devices-popup">
//             <div className="devices-popup-content">
//               <h3>Online Devices ({onlineDevicesCount})</h3>
//               <div className="devices-list">
//                 {onlineDevices.length > 0 ? (
//                   <ul>
//                     {onlineDevices.map(deviceId => (
//                       <li key={deviceId}>
//                         <span className="device-status-indicator online"></span>
//                         {deviceId}
//                         {deviceLocations[deviceId] && (
//                           <span className="device-location">
//                             - {deviceLocations[deviceId].device_location} 
//                             {deviceLocations[deviceId].device_site_name && ` (${deviceLocations[deviceId].device_site_name})`}
//                           </span>
//                         )}
//                         {!deviceLocations[deviceId] && (
//                           <span className="device-location no-location">- No location data</span>
//                         )}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No online devices</p>
//                 )}
//               </div>
//               <button 
//                 onClick={() => setShowOnlineDevices(false)}
//                 className="close-popup-button"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Offline Devices Popup */}
//         {showOfflineDevices && (
//           <div className="devices-popup">
//             <div className="devices-popup-content">
//               <h3>Offline Devices ({offlineDevicesCount})</h3>
//               <div className="devices-list">
//                 {offlineDevices.length > 0 ? (
//                   <ul>
//                     {offlineDevices.map(deviceId => (
//                       <li key={deviceId}>
//                         <span className="device-status-indicator offline"></span>
//                         {deviceId}
//                         {deviceLocations[deviceId] && (
//                           <span className="device-location">
//                             - {deviceLocations[deviceId].device_location}
//                             {deviceLocations[deviceId].device_site_name && ` (${deviceLocations[deviceId].device_site_name})`}
//                           </span>
//                         )}
//                         {!deviceLocations[deviceId] && (
//                           <span className="device-location no-location">- No location data</span>
//                         )}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No offline devices</p>
//                 )}
//               </div>
//               <button 
//                 onClick={() => setShowOfflineDevices(false)}
//                 className="close-popup-button"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Charts and Map Section */}
//         <div className="chart-section">
//           <h3 className="chart-title">DEVICE LOCATIONS & FLOW METRICS</h3>
//           <div className="charts-wrapper">
            
//             {/* Map Container */}
//             <div className="chart-container map-container">
//               <h4 className="chart-subtitle">
//                 <span className="flow-indicator" />
//                 Device Locations
//                 <span className="map-legend">
//                   <span className="legend-item">
//                     <span className="legend-color online"></span>
//                     Online
//                   </span>
//                   <span className="legend-item">
//                     <span className="legend-color offline"></span>
//                     Offline
//                   </span>
//                 </span>
//               </h4>
//               <div className="map-wrapper">
//                 <MapContainer
//                   center={mapCenter}
//                   zoom={devicesWithLocations.length > 0 ? 10 : 3}
//                   style={{ height: '350px', width: '100%', borderRadius: '8px' }}
//                   className="device-map"
//                 >
//                   <TileLayer
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                   />
//                   {devicesWithLocations.map((device) => (
//                     <Marker
//                       key={device.deviceId}
//                       position={[device.lat, device.lng]}
//                       icon={device.status === 'online' ? onlineIcon : offlineIcon}
//                     >
//                       <MapTooltip permanent={false} direction="top" offset={[0, -20]} opacity={0.9}>
//                         <div className="map-tooltip">
//                           {device.deviceId}
//                         </div>
//                       </MapTooltip>
//                       <Popup>
//                         <div className="device-popup">
//                           <h4>{device.deviceId}</h4>
//                           <p><strong>Device Type:</strong> {device.device_name}</p>
//                           <p><strong>Status:</strong> 
//                             <span className={`status-text ${device.status}`}>
//                               {device.status.toUpperCase()}
//                             </span>
//                           </p>
//                           <p><strong>Location:</strong> {device.device_location}</p>
//                           <p><strong>Site:</strong> {device.device_site_name}</p>
//                           <p><strong>Coordinates:</strong> {device.lat.toFixed(6)}, {device.lng.toFixed(6)}</p>
//                         </div>
//                       </Popup>
//                     </Marker>
//                   ))}
//                 </MapContainer>
//               </div>
//               {/* Map fallback information */}
//               {devicesWithLocations.length === 0 && (
//                 <div className="map-info">
//                   <p>No devices with location data available</p>
//                   <p className="map-info-subtitle">
//                     {totalDevicesCount} devices found, but none have valid GPS coordinates configured
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Line Chart Container */}
//             <div className="chart-container">
//               <h4 className="chart-subtitle">
//                 <span className="flow-indicator" />
//                 Flow Channel Trends
//               </h4>
//               {lineChartData.length > 0 ? (
//                 <ResponsiveContainer width="100%" height={350}>
//                   <LineChart data={lineChartData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
//                     <XAxis 
//                       dataKey="time" 
//                       stroke="#94a3b8"
//                       tick={{ fontSize: 12 }}
//                     />
//                     <YAxis 
//                       stroke="#94a3b8"
//                       tick={{ fontSize: 12 }}
//                     />
//                     <Tooltip 
//                       content={<LineTooltip />}
//                       contentStyle={{
//                         background: 'rgba(22, 22, 34, 0.95)',
//                         border: '1px solid rgba(0, 212, 255, 0.3)',
//                         borderRadius: '8px',
//                         padding: '12px',
//                         backdropFilter: 'blur(8px)'
//                       }}
//                     />
//                     <Legend 
//                       formatter={(value, entry) => (
//                         <span style={{ color: entry.color, display: 'flex', alignItems: 'center' }}>
//                           <span style={{
//                             display: 'inline-block',
//                             width: '10px',
//                             height: '10px',
//                             background: entry.color,
//                             borderRadius: '2px',
//                             marginRight: '8px'
//                           }} />
//                           {value}
//                         </span>
//                       )}
//                       wrapperStyle={{ paddingTop: '10px' }}
//                     />
//                     {lineColors.map((color, idx) => (
//                       lineChartData.some(item => item[`data${idx + 1}`] !== undefined) && (
//                         <Line
//                           key={`line-${idx}`}
//                           type="monotone"
//                           dataKey={`data${idx + 1}`}
//                           name={`Channel ${idx + 1}`}
//                           stroke={color}
//                           strokeWidth={2}
//                           dot={{ r: 3 }}
//                           activeDot={{ 
//                             r: 6,
//                             stroke: color,
//                             strokeWidth: 2,
//                             fill: 'rgba(22, 22, 34, 0.8)'
//                           }}
//                           animationDuration={1000}
//                         />
//                       )
//                     ))}
//                   </LineChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <p>No trend data available</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import API from "../services/api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup, Tooltip as MapTooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "../styles/dashboard.css";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to auto-fit map bounds to markers
const MapBounds = ({ locations }) => {
  const map = useMap();
  
  useEffect(() => {
    if (locations && locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [locations, map]);
  
  return null;
};

// Smaller custom icons for online/offline devices
const createCustomIcon = (status) => {
  const color = status === 'online' ? '#10b981' : '#ef4444';
  const symbol = status === 'online' ? '●' : '○';
  
  return new L.DivIcon({
    html: `
      <div class="custom-marker ${status}" style="
        width: 16px;
        height: 16px;
        background: ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 4px ${color};
        border: 2px solid white;
        cursor: pointer;
        transition: transform 0.2s;
      ">
        <div class="marker-pulse" style="
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: ${color};
          opacity: 0.6;
          animation: markerPulse 1.5s infinite;
        "></div>
        <div style="font-size: 8px; color: white; position: relative; z-index: 2;">${symbol}</div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });
};

const onlineIcon = createCustomIcon('online');
const offlineIcon = createCustomIcon('offline');

const lineColors = ["#00d4ff", "#0066ff", "#6ee7b7", "#3b82f6", "#8b5cf6", "#ec4899"];

// Custom Line Chart Tooltip Component
const LineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const deviceId = payload[0]?.payload?.device_id || 'Unknown';
    
    return (
      <div className="custom-tooltip">
        <p style={{ 
          fontWeight: 'bold',
          color: '#00d4ff',
          borderBottom: '1px solid rgba(0, 212, 255, 0.3)',
          paddingBottom: '5px',
          marginBottom: '10px'
        }}>
          {label}
        </p>
        <p style={{ color: '#94a3b8', marginBottom: '15px' }}>
          Device: {deviceId}
        </p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} style={{ 
            display: 'flex',
            alignItems: 'center',
            margin: '5px 0'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              backgroundColor: entry.color,
              borderRadius: '2px',
              marginRight: '8px'
            }} />
            <span style={{ color: entry.color }}>
              {entry.name}: <strong>{typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}</strong>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Stats Box Component
const StatsBox = ({ icon, label, value, onClick, clickable }) => (
  <div 
    className={`stat-box ${clickable ? 'clickable' : ''}`} 
    onClick={onClick}
    role={clickable ? "button" : undefined}
    tabIndex={clickable ? 0 : undefined}
    onKeyPress={clickable ? (e) => e.key === 'Enter' && onClick() : undefined}
  >
    <div className="stat-icon">{icon}</div>
    <p className="stat-label">{label}</p>
    <p className="stat-value">{value}</p>
  </div>
);

// Device Popup Component
const DevicePopup = ({ title, devices, deviceLocations, onClose }) => (
  <div className="devices-popup">
    <div className="devices-popup-content">
      <h3>{title} ({devices.length})</h3>
      <div className="devices-list">
        {devices.length > 0 ? (
          <ul>
            {devices.map(deviceId => (
              <li key={deviceId}>
                <span className={`device-status-indicator ${title.toLowerCase().includes('online') ? 'online' : 'offline'}`}></span>
                {deviceId}
                {deviceLocations[deviceId] && (
                  <span className="device-location">
                    - {deviceLocations[deviceId].device_location || 'Unknown Location'} 
                    {deviceLocations[deviceId].device_site_name && ` (${deviceLocations[deviceId].device_site_name})`}
                  </span>
                )}
                {!deviceLocations[deviceId] && (
                  <span className="device-location no-location">- No location data</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No {title.toLowerCase()} devices</p>
        )}
      </div>
      <button onClick={onClose} className="close-popup-button">Close</button>
    </div>
  </div>
);

const Dashboard = () => {
  const [sensorData, setSensorData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [deviceStatus, setDeviceStatus] = useState({});
  const [deviceLocations, setDeviceLocations] = useState({});
  const [showOnlineDevices, setShowOnlineDevices] = useState(false);
  const [showOfflineDevices, setShowOfflineDevices] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  
  const dashboardRef = useRef(null);
  const animationElementsRef = useRef({ droplets: [], pipes: [], bubbles: [] });
  const intervalRef = useRef(null);

  // Extract all devices from users data with their locations
  const extractDevicesFromUsers = useCallback((users) => {
    const devices = [];
    const locations = {};
    
    users.forEach(user => {
      if (user.devices && user.devices.length > 0) {
        user.devices.forEach(device => {
          const deviceId = device.device_id;
          if (deviceId) {
            devices.push({
              device_id: deviceId,
              device_name: device.device_name || 'flow-meter',
              device_location: device.device_location || 'Unknown',
              device_site_name: device.device_site_name || '',
              latitude: device.latitude,
              longitude: device.longitude
            });
            
            // Store location if valid coordinates exist
            const lat = device.latitude;
            const lng = device.longitude;
            
            if (lat && lng && lat !== 'NA' && lng !== 'NA' && lat !== '' && lng !== '' && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
              const parsedLat = parseFloat(lat);
              const parsedLng = parseFloat(lng);
              
              if (parsedLat >= -90 && parsedLat <= 90 && parsedLng >= -180 && parsedLng <= 180) {
                locations[deviceId] = {
                  lat: parsedLat,
                  lng: parsedLng,
                  device_location: device.device_location || 'Unknown Location',
                  device_site_name: device.device_site_name || 'Unknown Site',
                  device_name: device.device_name || 'Unknown Device'
                };
              }
            }
          }
        });
      }
    });
    
    return { devices, locations };
  }, []);

  // Fetch users and extract device info
  const fetchUsersAndDevices = useCallback(async () => {
    try {
      const response = await API.get("/users");
      const users = response?.data || [];
      setUsersData(users);
      
      const { devices, locations } = extractDevicesFromUsers(users);
      setDeviceLocations(locations);
      
      return devices;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }, [extractDevicesFromUsers]);

  // Check single device online status using limit=1
  const checkDeviceStatus = useCallback(async (deviceId) => {
    try {
      const response = await API.get(`/sensor-data?device_id=${deviceId}&limit=1`);
      const data = response?.data?.data || [];
      
      if (data.length === 0) return 'offline';
      
      const latestReading = data[0];
      const readingDate = new Date(latestReading.createdAt);
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      return readingDate >= todayStart ? 'online' : 'offline';
    } catch (error) {
      console.error(`Error checking status for device ${deviceId}:`, error);
      return 'offline';
    }
  }, []);

  // Check all devices status
  const checkAllDevicesStatus = useCallback(async (devices) => {
    if (!devices || devices.length === 0) return;
    
    setIsCheckingStatus(true);
    
    const statusPromises = devices.map(async (device) => {
      const deviceId = device.device_id;
      const status = await checkDeviceStatus(deviceId);
      return { deviceId, status };
    });
    
    const results = await Promise.all(statusPromises);
    
    const newStatusMap = {};
    results.forEach(({ deviceId, status }) => {
      newStatusMap[deviceId] = status;
    });
    
    setDeviceStatus(newStatusMap);
    setIsCheckingStatus(false);
    setLastUpdated(new Date());
    
    return newStatusMap;
  }, [checkDeviceStatus]);

  // Fetch recent sensor data for charts
  const fetchRecentSensorData = useCallback(async () => {
    try {
      let url = '/sensor-data?limit=50';
      if (selectedDevice !== 'all') {
        url = `/sensor-data?device_id=${selectedDevice}&limit=20`;
      }
      
      const response = await API.get(url);
      const data = response?.data?.data || [];
      setSensorData(data);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  }, [selectedDevice]);

  // Initial data load
  useEffect(() => {
    const initializeDashboard = async () => {
      const devices = await fetchUsersAndDevices();
      
      if (devices.length > 0) {
        await checkAllDevicesStatus(devices);
      }
      
      await fetchRecentSensorData();
    };
    
    initializeDashboard();
    
    intervalRef.current = setInterval(async () => {
      const devices = await fetchUsersAndDevices();
      if (devices.length > 0) {
        await checkAllDevicesStatus(devices);
      }
      await fetchRecentSensorData();
    }, 30000);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchUsersAndDevices, checkAllDevicesStatus, fetchRecentSensorData]);

  // Refresh when selected device changes
  useEffect(() => {
    fetchRecentSensorData();
  }, [selectedDevice, fetchRecentSensorData]);

  // Get all unique device IDs from users data
  const allDevices = useMemo(() => {
    const devices = [];
    usersData.forEach(user => {
      if (user.devices) {
        user.devices.forEach(device => {
          if (device.device_id) {
            devices.push(device.device_id);
          }
        });
      }
    });
    return [...new Set(devices)];
  }, [usersData]);

  const onlineDevices = useMemo(() => 
    Object.entries(deviceStatus)
      .filter(([_, status]) => status === "online")
      .map(([deviceId]) => deviceId),
    [deviceStatus]
  );

  const offlineDevices = useMemo(() => 
    Object.entries(deviceStatus)
      .filter(([_, status]) => status === "offline")
      .map(([deviceId]) => deviceId),
    [deviceStatus]
  );

  const onlineDevicesCount = onlineDevices.length;
  const offlineDevicesCount = offlineDevices.length;
  const totalDevicesCount = allDevices.length;
  const totalUsersCount = usersData.length;

  // Recent data for charts
  const recentSensorData = useMemo(() => 
    [...sensorData]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(-10),
    [sensorData]
  );

  const lineChartData = useMemo(() => 
    recentSensorData.map((item) => ({
      time: `${new Date(item.createdAt).toLocaleDateString()} ${new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      ...(item.data1 !== undefined && { data1: item.data1 }),
      ...(item.data2 !== undefined && { data2: item.data2 }),
      ...(item.data3 !== undefined && { data3: item.data3 }),
      ...(item.data4 !== undefined && { data4: item.data4 }),
      ...(item.data5 !== undefined && { data5: item.data5 }),
      ...(item.data6 !== undefined && { data6: item.data6 }),
      device_id: item.device_id
    })),
    [recentSensorData]
  );

  const devicesWithLocations = useMemo(() => 
    Object.entries(deviceLocations)
      .map(([deviceId, location]) => ({
        deviceId,
        ...location,
        status: deviceStatus[deviceId] || 'offline'
      })),
    [deviceLocations, deviceStatus]
  );

  // Map center and zoom will be handled by MapBounds component
  const defaultCenter = [20.5937, 78.9629]; // India center
  const defaultZoom = 5;

  // Animation setup
  useEffect(() => {
    const container = dashboardRef.current;
    if (!container) return;

    const createDroplets = () => {
      const droplets = [];
      const dropletCount = Math.min(Math.floor(window.innerWidth / 20), 50);
      
      for (let i = 0; i < dropletCount; i++) {
        const droplet = document.createElement('div');
        droplet.classList.add('water-droplet');
        
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        droplet.style.width = `${size}px`;
        droplet.style.height = `${size}px`;
        droplet.style.left = `${left}vw`;
        droplet.style.animationDelay = `${delay}s`;
        droplet.style.animationDuration = `${duration}s`;
        
        container.appendChild(droplet);
        droplets.push(droplet);
      }
      return droplets;
    };

    const createPipes = () => {
      const pipes = [];
      const pipeCount = 3;
      
      for (let i = 0; i < pipeCount; i++) {
        const pipe = document.createElement('div');
        pipe.classList.add('pipe-animation');
        
        const top = Math.random() * 100;
        const width = Math.random() * 200 + 100;
        const delay = Math.random() * 3;
        const duration = Math.random() * 20 + 10;
        
        pipe.style.top = `${top}vh`;
        pipe.style.width = `${width}px`;
        pipe.style.animationDelay = `${delay}s`;
        pipe.style.animationDuration = `${duration}s`;
        
        container.appendChild(pipe);
        pipes.push(pipe);
      }
      return pipes;
    };

    const createBubbles = () => {
      const bubbles = [];
      const bubbleCount = Math.min(Math.floor(window.innerWidth / 15), 60);
      
      for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        const size = Math.random() * 15 + 5;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 5;
        
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}vw`;
        bubble.style.top = `${top}vh`;
        bubble.style.animationDelay = `${delay}s`;
        bubble.style.animationDuration = `${duration}s`;
        
        container.appendChild(bubble);
        bubbles.push(bubble);
      }
      return bubbles;
    };

    const initAnimations = () => {
      if (animationElementsRef.current.droplets.length) {
        animationElementsRef.current.droplets.forEach(el => el?.remove());
        animationElementsRef.current.pipes.forEach(el => el?.remove());
        animationElementsRef.current.bubbles.forEach(el => el?.remove());
      }
      
      animationElementsRef.current.droplets = createDroplets();
      animationElementsRef.current.pipes = createPipes();
      animationElementsRef.current.bubbles = createBubbles();
    };

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initAnimations, 250);
    };

    initAnimations();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      if (animationElementsRef.current.droplets.length) {
        animationElementsRef.current.droplets.forEach(el => el?.remove());
        animationElementsRef.current.pipes.forEach(el => el?.remove());
        animationElementsRef.current.bubbles.forEach(el => el?.remove());
      }
    };
  }, []);

  return (
    <div className="dashboard-container" ref={dashboardRef}>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2 className="dashboard-title">FLOW METER ANALYTICS</h2>
          <div className="header-controls">
            <div className="device-filter">
              <select 
                value={selectedDevice} 
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="device-filter-select"
              >
                <option value="all">All Devices ({totalDevicesCount})</option>
                {allDevices.map(device => (
                  <option key={device} value={device}>
                    {device} {deviceStatus[device] === 'online' ? '🟢' : '🔴'}
                  </option>
                ))}
              </select>
            </div>
            {lastUpdated && (
              <div className="last-updated">
                Updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
            {isCheckingStatus && (
              <div className="status-checking">
                <span className="spinner-small"></span> Checking...
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-stats">
          <StatsBox 
            icon="⚡" 
            label="Online Devices" 
            value={onlineDevicesCount} 
            onClick={() => setShowOnlineDevices(true)}
            clickable={true}
          />
          
          <StatsBox 
            icon="🔧" 
            label="Offline Devices" 
            value={offlineDevicesCount}
            onClick={() => setShowOfflineDevices(true)}
            clickable={true}
          />
          
          <StatsBox 
            icon="👨‍💼" 
            label="System Users" 
            value={totalUsersCount}
          />
        </div>

        {showOnlineDevices && (
          <DevicePopup 
            title="Online Devices" 
            devices={onlineDevices}
            deviceLocations={deviceLocations}
            onClose={() => setShowOnlineDevices(false)}
          />
        )}

        {showOfflineDevices && (
          <DevicePopup 
            title="Offline Devices" 
            devices={offlineDevices}
            deviceLocations={deviceLocations}
            onClose={() => setShowOfflineDevices(false)}
          />
        )}

        <div className="chart-section">
          <h3 className="chart-title">DEVICE LOCATIONS & FLOW METRICS</h3>
          <div className="charts-wrapper">
            
            <div className="chart-container map-container">
              <h4 className="chart-subtitle">
                <span className="flow-indicator" />
                Device Locations
                <span className="map-legend">
                  <span className="legend-item">
                    <span className="legend-color online"></span>
                    Online
                  </span>
                  <span className="legend-item">
                    <span className="legend-color offline"></span>
                    Offline
                  </span>
                </span>
              </h4>
              <div className="map-wrapper">
                {devicesWithLocations.length > 0 ? (
                  <MapContainer
                    center={defaultCenter}
                    zoom={defaultZoom}
                    style={{ height: '350px', width: '100%', borderRadius: '8px' }}
                    className="device-map"
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapBounds locations={devicesWithLocations} />
                    {devicesWithLocations.map((device) => (
                      <Marker
                        key={device.deviceId}
                        position={[device.lat, device.lng]}
                        icon={device.status === 'online' ? onlineIcon : offlineIcon}
                      >
                        <MapTooltip permanent={false} direction="top" offset={[0, -12]} opacity={0.9}>
                          <div className="map-tooltip" style={{ fontSize: '11px', padding: '4px 8px' }}>
                            {device.deviceId}
                          </div>
                        </MapTooltip>
                        <Popup>
                          <div className="device-popup">
                            <h4>{device.deviceId}</h4>
                            <p><strong>Device Type:</strong> {device.device_name}</p>
                            <p><strong>Status:</strong> 
                              <span className={`status-text ${device.status}`}>
                                {device.status.toUpperCase()}
                              </span>
                            </p>
                            <p><strong>Location:</strong> {device.device_location}</p>
                            <p><strong>Site:</strong> {device.device_site_name}</p>
                            <p><strong>Coordinates:</strong> {device.lat.toFixed(6)}, {device.lng.toFixed(6)}</p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className="map-info">
                    <p>No devices with location data available</p>
                    <p className="map-info-subtitle">
                      {totalDevicesCount} devices found, but none have valid GPS coordinates configured
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="chart-container">
              <h4 className="chart-subtitle">
                <span className="flow-indicator" />
                Flow Channel Trends
                {selectedDevice !== 'all' && (
                  <span className="filter-badge">Device: {selectedDevice}</span>
                )}
              </h4>
              {lineChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#94a3b8"
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      content={<LineTooltip />}
                      contentStyle={{
                        background: 'rgba(22, 22, 34, 0.95)',
                        border: '1px solid rgba(0, 212, 255, 0.3)',
                        borderRadius: '8px',
                        padding: '12px',
                        backdropFilter: 'blur(8px)'
                      }}
                    />
                    <Legend 
                      formatter={(value, entry) => (
                        <span style={{ color: entry.color, display: 'flex', alignItems: 'center' }}>
                          <span style={{
                            display: 'inline-block',
                            width: '10px',
                            height: '10px',
                            background: entry.color,
                            borderRadius: '2px',
                            marginRight: '8px'
                          }} />
                          {value}
                        </span>
                      )}
                      wrapperStyle={{ paddingTop: '10px' }}
                    />
                    {lineColors.map((color, idx) => (
                      lineChartData.some(item => item[`data${idx + 1}`] !== undefined) && (
                        <Line
                          key={`line-${idx}`}
                          type="monotone"
                          dataKey={`data${idx + 1}`}
                          name={`Channel ${idx + 1}`}
                          stroke={color}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ 
                            r: 6,
                            stroke: color,
                            strokeWidth: 2,
                            fill: 'rgba(22, 22, 34, 0.8)'
                          }}
                          animationDuration={500}
                          isAnimationActive={true}
                        />
                      )
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data-message">
                  <p>No trend data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;