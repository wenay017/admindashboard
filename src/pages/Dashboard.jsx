// // // import React, { useEffect, useState, useRef } from "react";
// // // import API from "../services/api";
// // // import {
// // //   PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,
// // //   LineChart, Line, XAxis, YAxis, CartesianGrid
// // // } from "recharts";
// // // import "../styles/dashboard.css";

// // // const COLORS = ["#00d4ff", "#0066ff", "#6ee7b7", "#3b82f6", "#8b5cf6", "#ec4899"];
// // // const lineColors = ["#00d4ff", "#0066ff", "#6ee7b7", "#3b82f6", "#8b5cf6", "#ec4899"];

// // // const Dashboard = () => {
// // //   const [sensorData, setSensorData] = useState([]);
// // //   const [users, setUsers] = useState([]);
// // //   const [pieData, setPieData] = useState([]);
// // //   const [uniqueDevices, setUniqueDevices] = useState([]);
// // //   const [deviceStatus, setDeviceStatus] = useState({});
// // //   const [userGrowth, setUserGrowth] = useState(0);
// // //   const [showOnlineDevices, setShowOnlineDevices] = useState(false);
// // //   const [showOfflineDevices, setShowOfflineDevices] = useState(false);
// // //   const dashboardRef = useRef(null);

// // //   // Animation effects
// // //   useEffect(() => {
// // //     const createDroplets = () => {
// // //       const container = dashboardRef.current;
// // //       if (!container) return;
      
// // //       const dropletCount = Math.floor(window.innerWidth / 20);
      
// // //       for (let i = 0; i < dropletCount; i++) {
// // //         const droplet = document.createElement('div');
// // //         droplet.classList.add('water-droplet');
        
// // //         const size = Math.random() * 10 + 5;
// // //         const left = Math.random() * 100;
// // //         const delay = Math.random() * 5;
// // //         const duration = Math.random() * 10 + 10;
        
// // //         droplet.style.width = `${size}px`;
// // //         droplet.style.height = `${size}px`;
// // //         droplet.style.left = `${left}vw`;
// // //         droplet.style.animationDelay = `${delay}s`;
// // //         droplet.style.animationDuration = `${duration}s`;
        
// // //         container.appendChild(droplet);
// // //       }
// // //     };

// // //     const createPipes = () => {
// // //       const container = dashboardRef.current;
// // //       if (!container) return;
      
// // //       const pipeCount = 3;
      
// // //       for (let i = 0; i < pipeCount; i++) {
// // //         const pipe = document.createElement('div');
// // //         pipe.classList.add('pipe-animation');
        
// // //         const top = Math.random() * 100;
// // //         const width = Math.random() * 200 + 100;
// // //         const delay = Math.random() * 3;
// // //         const duration = Math.random() * 20 + 10;
        
// // //         pipe.style.top = `${top}vh`;
// // //         pipe.style.width = `${width}px`;
// // //         pipe.style.animationDelay = `${delay}s`;
// // //         pipe.style.animationDuration = `${duration}s`;
        
// // //         container.appendChild(pipe);
// // //       }
// // //     };

// // //     const createBubbles = () => {
// // //       const container = dashboardRef.current;
// // //       if (!container) return;
      
// // //       const bubbleCount = Math.floor(window.innerWidth / 15);
      
// // //       for (let i = 0; i < bubbleCount; i++) {
// // //         const bubble = document.createElement('div');
// // //         bubble.classList.add('bubble');
        
// // //         const size = Math.random() * 15 + 5;
// // //         const left = Math.random() * 100;
// // //         const top = Math.random() * 100;
// // //         const delay = Math.random() * 5;
// // //         const duration = Math.random() * 10 + 5;
        
// // //         bubble.style.width = `${size}px`;
// // //         bubble.style.height = `${size}px`;
// // //         bubble.style.left = `${left}vw`;
// // //         bubble.style.top = `${top}vh`;
// // //         bubble.style.animationDelay = `${delay}s`;
// // //         bubble.style.animationDuration = `${duration}s`;
        
// // //         container.appendChild(bubble);
// // //       }
// // //     };

// // //     const initAnimations = () => {
// // //       const existing = dashboardRef.current.querySelectorAll('.water-droplet, .pipe-animation, .bubble');
// // //       existing.forEach(el => el.remove());
// // //       createDroplets();
// // //       createPipes();
// // //       createBubbles();
// // //     };

// // //     initAnimations();
// // //     window.addEventListener('resize', initAnimations);
// // //     return () => window.removeEventListener('resize', initAnimations);
// // //   }, []);

// // //   useEffect(() => {
// // //     const fetchDashboardData = async () => {
// // //       try {
// // //         const [sensorRes, userRes] = await Promise.all([
// // //           API.get("/sensor-data"),
// // //           API.get("/users"),
// // //         ]);

// // //         const sensor = sensorRes.data.data || [];
// // //         const userList = userRes.data || [];
// // //         const uniqueDeviceList = [...new Set(sensor.map((item) => item.device_id))];

// // //         // Calculate device status (online/offline)
// // //         const statusMap = {};
// // //         const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        
// // //         uniqueDeviceList.forEach(deviceId => {
// // //           const deviceData = sensor.filter(d => d.device_id === deviceId);
// // //           const latestData = deviceData.reduce((latest, current) => 
// // //             new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
// // //           );
// // //           statusMap[deviceId] = new Date(latestData.createdAt) > oneHourAgo ? "online" : "offline";
// // //         });

// // //         // Calculate user growth percentage (monthly)
// // //         const currentMonth = new Date().getMonth();
// // //         const currentYear = new Date().getFullYear();
// // //         const prevMonthUsers = userList.filter(user => {
// // //           const userDate = new Date(user.createdAt);
// // //           return userDate.getMonth() === (currentMonth === 0 ? 11 : currentMonth - 1) && 
// // //                  userDate.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear);
// // //         }).length;
        
// // //         const growthPercentage = prevMonthUsers > 0 
// // //           ? Math.round(((userList.length - prevMonthUsers) / prevMonthUsers) * 100)
// // //           : userList.length > 0 ? 100 : 0;

// // //         setSensorData(sensor);
// // //         setUsers(userList);
// // //         setUniqueDevices(uniqueDeviceList);
// // //         setDeviceStatus(statusMap);
// // //         setUserGrowth(growthPercentage);

// // //         setPieData([
// // //           { name: "Users", value: userList.length },
// // //           { name: "Sensor Entries", value: sensor.length },
// // //           { name: "Unique Devices", value: uniqueDeviceList.length },
// // //         ]);
// // //       } catch (error) {
// // //         console.error("Error loading dashboard data:", error);
// // //       }
// // //     };

// // //     fetchDashboardData();
// // //     const interval = setInterval(fetchDashboardData, 30000);
// // //     return () => clearInterval(interval);
// // //   }, []);

// // //   const recentSensorData = [...sensorData]
// // //     .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
// // //     .slice(-10);

// // //   const timeDeviceMap = {};
// // //   recentSensorData.forEach(item => {
// // //     const timeKey = `${new Date(item.createdAt).toLocaleDateString()} ${new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
// // //     timeDeviceMap[timeKey] = item.device_id;
// // //   });

// // //   const lineChartData = recentSensorData.map((item) => ({
// // //     time: `${new Date(item.createdAt).toLocaleDateString()} ${new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
// // //     ...(item.data1 !== undefined && { data1: item.data1 }),
// // //     ...(item.data2 !== undefined && { data2: item.data2 }),
// // //     ...(item.data3 !== undefined && { data3: item.data3 }),
// // //     ...(item.data4 !== undefined && { data4: item.data4 }),
// // //     ...(item.data5 !== undefined && { data5: item.data5 }),
// // //     ...(item.data6 !== undefined && { data6: item.data6 }),
// // //     device_id: item.device_id
// // //   }));

// // //   // Count online and offline devices
// // //   const onlineDevices = Object.entries(deviceStatus)
// // //     .filter(([_, status]) => status === "online")
// // //     .map(([deviceId]) => deviceId);
  
// // //   const offlineDevices = Object.entries(deviceStatus)
// // //     .filter(([_, status]) => status === "offline")
// // //     .map(([deviceId]) => deviceId);

// // //   const onlineDevicesCount = onlineDevices.length;
// // //   const offlineDevicesCount = offlineDevices.length;
// // //   const totalDevicesCount = uniqueDevices.length;

// // //   // Custom Pie Chart Tooltip
// // //   const PieTooltip = ({ active, payload }) => {
// // //     if (active && payload && payload.length) {
// // //       return (
// // //         <div className="custom-tooltip">
// // //           <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
// // //             <div style={{
// // //               width: '12px',
// // //               height: '12px',
// // //               backgroundColor: payload[0].payload.fill,
// // //               borderRadius: '50%',
// // //               marginRight: '8px'
// // //             }} />
// // //             <p style={{ 
// // //               color: payload[0].payload.fill, 
// // //               fontWeight: 'bold',
// // //               margin: 0
// // //             }}>
// // //               {payload[0].name}
// // //             </p>
// // //           </div>
// // //           <p style={{ margin: 0 }}>
// // //             {payload[0].value} ({((payload[0].payload.percent || 0) * 100).toFixed(1)}%)
// // //           </p>
// // //         </div>
// // //       );
// // //     }
// // //     return null;
// // //   };

// // //   // Custom Line Chart Tooltip
// // //   const LineTooltip = ({ active, payload, label }) => {
// // //     if (active && payload && payload.length) {
// // //       return (
// // //         <div className="custom-tooltip">
// // //           <p style={{ 
// // //             fontWeight: 'bold',
// // //             color: '#00d4ff',
// // //             borderBottom: '1px solid rgba(0, 212, 255, 0.3)',
// // //             paddingBottom: '5px',
// // //             marginBottom: '10px'
// // //           }}>
// // //             {label}
// // //           </p>
// // //           <p style={{ color: '#94a3b8', marginBottom: '15px' }}>
// // //             Device: {timeDeviceMap[label] || 'Unknown'}
// // //           </p>
// // //           {payload.map((entry, index) => (
// // //             <div key={`item-${index}`} style={{ 
// // //               display: 'flex',
// // //               alignItems: 'center',
// // //               margin: '5px 0'
// // //             }}>
// // //               <div style={{
// // //                 width: '10px',
// // //                 height: '10px',
// // //                 backgroundColor: entry.color,
// // //                 borderRadius: '2px',
// // //                 marginRight: '8px'
// // //               }} />
// // //               <span style={{ color: entry.color }}>
// // //                 {entry.name}: <strong>{entry.value}</strong>
// // //               </span>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       );
// // //     }
// // //     return null;
// // //   };

// // //   return (
// // //     <div className="dashboard-container" ref={dashboardRef}>
// // //       <div className="dashboard-content">
// // //         <div className="dashboard-header">
// // //           <h2 className="dashboard-title">FLOW METER ANALYTICS</h2>
// // //         </div>

// // //         <div className="dashboard-stats">
// // //           <div className="stat-box">
// // //             <div className="stat-icon">📊</div>
// // //             <p className="stat-label">Sensor Entries</p>
// // //             <p className="stat-value">{sensorData.length}</p>
// // //             <p className="stat-unit">readings</p>
// // //           </div>
          
// // //           <div className="stat-box" onClick={() => setShowOnlineDevices(true)}>
// // //             <div className="stat-icon">🟢</div>
// // //             <p className="stat-label">Online Devices</p>
// // //             <p className="stat-value">{onlineDevicesCount}</p>
// // //             <div className="valve-status valve-open">
// // //               Click to view
// // //             </div>
// // //           </div>
          
// // //           <div className="stat-box" onClick={() => setShowOfflineDevices(true)}>
// // //             <div className="stat-icon">🔴</div>
// // //             <p className="stat-label">Offline Devices</p>
// // //             <p className="stat-value">{offlineDevicesCount}</p>
// // //             <div className="valve-status valve-closed">
// // //               Click to view
// // //             </div>
// // //           </div>
          
// // //           <div className="stat-box">
// // //             <div className="stat-icon">👥</div>
// // //             <p className="stat-label">System Users</p>
// // //             <p className="stat-value">{users.length}</p>
// // //             <p className="stat-trend" style={{ color: userGrowth >= 0 ? '#6ee7b7' : '#ef4444' }}>
// // //               {userGrowth >= 0 ? '↑' : '↓'} {Math.abs(userGrowth)}%
// // //             </p>
// // //           </div>
// // //         </div>

// // //         {/* Online Devices Popup */}
// // //         {showOnlineDevices && (
// // //           <div className="devices-popup">
// // //             <div className="devices-popup-content">
// // //               <h3>Online Devices ({onlineDevicesCount})</h3>
// // //               <div className="devices-list">
// // //                 {onlineDevices.length > 0 ? (
// // //                   <ul>
// // //                     {onlineDevices.map(deviceId => (
// // //                       <li key={deviceId}>
// // //                         <span className="device-status-indicator online"></span>
// // //                         {deviceId}
// // //                       </li>
// // //                     ))}
// // //                   </ul>
// // //                 ) : (
// // //                   <p>No online devices</p>
// // //                 )}
// // //               </div>
// // //               <button 
// // //                 onClick={() => setShowOnlineDevices(false)}
// // //                 className="close-popup-button"
// // //               >
// // //                 Close
// // //               </button>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* Offline Devices Popup */}
// // //         {showOfflineDevices && (
// // //           <div className="devices-popup">
// // //             <div className="devices-popup-content">
// // //               <h3>Offline Devices ({offlineDevicesCount})</h3>
// // //               <div className="devices-list">
// // //                 {offlineDevices.length > 0 ? (
// // //                   <ul>
// // //                     {offlineDevices.map(deviceId => (
// // //                       <li key={deviceId}>
// // //                         <span className="device-status-indicator offline"></span>
// // //                         {deviceId}
// // //                       </li>
// // //                     ))}
// // //                   </ul>
// // //                 ) : (
// // //                   <p>No offline devices</p>
// // //                 )}
// // //               </div>
// // //               <button 
// // //                 onClick={() => setShowOfflineDevices(false)}
// // //                 className="close-popup-button"
// // //               >
// // //                 Close
// // //               </button>
// // //             </div>
// // //           </div>
// // //         )}

// // //         <div className="chart-section">
// // //           <h3 className="chart-title">FLOW METRICS</h3>
// // //           <div className="charts-wrapper">
// // //             <div className="chart-container">
// // //               <h4 className="chart-subtitle">
// // //                 <span className="flow-indicator" />
// // //                 Data Distribution
// // //               </h4>
// // //               {pieData.length > 0 ? (
// // //                 <ResponsiveContainer width="100%" height={350}>
// // //                   <PieChart>
// // //                     <Pie
// // //                       data={pieData}
// // //                       dataKey="value"
// // //                       nameKey="name"
// // //                       cx="50%"
// // //                       cy="50%"
// // //                       innerRadius={70}
// // //                       outerRadius={110}
// // //                       paddingAngle={2}
// // //                       label={({ name }) => name}
// // //                       labelLine={false}
// // //                     >
// // //                       {pieData.map((entry, index) => (
// // //                         <Cell 
// // //                           key={`cell-${index}`} 
// // //                           fill={COLORS[index % COLORS.length]}
// // //                           stroke="rgba(22, 22, 34, 0.8)"
// // //                           strokeWidth={2}
// // //                         />
// // //                       ))}
// // //                     </Pie>
// // //                     <Tooltip 
// // //                       content={<PieTooltip />}
// // //                       wrapperStyle={{
// // //                         background: 'rgba(22, 22, 34, 0.95)',
// // //                         border: '1px solid rgba(0, 212, 255, 0.3)',
// // //                         borderRadius: '8px',
// // //                         padding: '12px',
// // //                         backdropFilter: 'blur(8px)'
// // //                       }}
// // //                     />
// // //                     <Legend 
// // //                       formatter={(value, entry) => (
// // //                         <span style={{ color: entry.color, display: 'flex', alignItems: 'center' }}>
// // //                           <span style={{
// // //                             display: 'inline-block',
// // //                             width: '12px',
// // //                             height: '12px',
// // //                             background: entry.color,
// // //                             borderRadius: '50%',
// // //                             marginRight: '8px'
// // //                           }} />
// // //                           {value}
// // //                         </span>
// // //                       )}
// // //                       wrapperStyle={{ paddingTop: '20px' }}
// // //                       layout="horizontal"
// // //                       verticalAlign="bottom"
// // //                       align="center"
// // //                     />
// // //                   </PieChart>
// // //                 </ResponsiveContainer>
// // //               ) : (
// // //                 <p>No chart data available</p>
// // //               )}
// // //             </div>

// // //             <div className="chart-container">
// // //               <h4 className="chart-subtitle">
// // //                 <span className="flow-indicator" />
// // //                 Flow Channel Trends
// // //               </h4>
// // //               {lineChartData.length > 0 ? (
// // //                 <ResponsiveContainer width="100%" height={350}>
// // //                   <LineChart data={lineChartData}>
// // //                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
// // //                     <XAxis 
// // //                       dataKey="time" 
// // //                       stroke="#94a3b8"
// // //                       tick={{ fontSize: 12 }}
// // //                     />
// // //                     <YAxis 
// // //                       stroke="#94a3b8"
// // //                       tick={{ fontSize: 12 }}
// // //                     />
// // //                     <Tooltip 
// // //                       content={<LineTooltip />}
// // //                       contentStyle={{
// // //                         background: 'rgba(22, 22, 34, 0.95)',
// // //                         border: '1px solid rgba(0, 212, 255, 0.3)',
// // //                         borderRadius: '8px',
// // //                         padding: '12px',
// // //                         backdropFilter: 'blur(8px)'
// // //                       }}
// // //                     />
// // //                     <Legend 
// // //                       formatter={(value, entry) => (
// // //                         <span style={{ color: entry.color, display: 'flex', alignItems: 'center' }}>
// // //                           <span style={{
// // //                             display: 'inline-block',
// // //                             width: '10px',
// // //                             height: '10px',
// // //                             background: entry.color,
// // //                             borderRadius: '2px',
// // //                             marginRight: '8px'
// // //                           }} />
// // //                           {value}
// // //                         </span>
// // //                       )}
// // //                       wrapperStyle={{ paddingTop: '10px' }}
// // //                     />
// // //                     {lineColors.map((color, idx) => (
// // //                       lineChartData.some(item => item[`data${idx + 1}`] !== undefined) && (
// // //                         <Line
// // //                           key={`line-${idx}`}
// // //                           type="monotone"
// // //                           dataKey={`data${idx + 1}`}
// // //                           name={`Channel ${idx + 1}`}
// // //                           stroke={color}
// // //                           strokeWidth={2}
// // //                           dot={{ r: 3 }}
// // //                           activeDot={{ 
// // //                             r: 6,
// // //                             stroke: color,
// // //                             strokeWidth: 2,
// // //                             fill: 'rgba(22, 22, 34, 0.8)'
// // //                           }}
// // //                           animationDuration={1000}
// // //                         />
// // //                       )
// // //                     ))}
// // //                   </LineChart>
// // //                 </ResponsiveContainer>
// // //               ) : (
// // //                 <p>No trend data available</p>
// // //               )}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;
// // import React, { useEffect, useState, useRef } from "react";
// // import API from "../services/api";
// // import {
// //   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// // } from "recharts";
// // import { MapContainer, TileLayer, Marker, Popup, Tooltip as MapTooltip } from 'react-leaflet';
// // import L from 'leaflet';
// // import 'leaflet/dist/leaflet.css';
// // import "../styles/dashboard.css";

// // // Fix for default markers in react-leaflet
// // delete L.Icon.Default.prototype._getIconUrl;
// // L.Icon.Default.mergeOptions({
// //   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
// //   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
// //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// // });

// // // Custom icons for online/offline devices with better design
// // const createCustomIcon = (status) => {
// //   const color = status === 'online' ? '#10b981' : '#ef4444';
// //   const symbol = status === 'online' ? '🟢' : '🔴';
  
// //   return new L.DivIcon({
// //     html: `
// //       <div class="custom-marker ${status}">
// //         <div class="marker-pulse"></div>
// //         <div class="marker-icon">${symbol}</div>
// //       </div>
// //     `,
// //     className: 'custom-div-icon',
// //     iconSize: [40, 40],
// //     iconAnchor: [20, 40],
// //   });
// // };

// // const onlineIcon = createCustomIcon('online');
// // const offlineIcon = createCustomIcon('offline');

// // const lineColors = ["#00d4ff", "#0066ff", "#6ee7b7", "#3b82f6", "#8b5cf6", "#ec4899"];

// // const Dashboard = () => {
// //   const [sensorData, setSensorData] = useState([]);
// //   const [users, setUsers] = useState([]);
// //   const [uniqueDevices, setUniqueDevices] = useState([]);
// //   const [deviceStatus, setDeviceStatus] = useState({});
// //   const [deviceLocations, setDeviceLocations] = useState({});
// //   const [userGrowth, setUserGrowth] = useState(0);
// //   const [showOnlineDevices, setShowOnlineDevices] = useState(false);
// //   const [showOfflineDevices, setShowOfflineDevices] = useState(false);
// //   const dashboardRef = useRef(null);

// //   // Animation effects
// //   useEffect(() => {
// //     const createDroplets = () => {
// //       const container = dashboardRef.current;
// //       if (!container) return;
      
// //       const dropletCount = Math.floor(window.innerWidth / 20);
      
// //       for (let i = 0; i < dropletCount; i++) {
// //         const droplet = document.createElement('div');
// //         droplet.classList.add('water-droplet');
        
// //         const size = Math.random() * 10 + 5;
// //         const left = Math.random() * 100;
// //         const delay = Math.random() * 5;
// //         const duration = Math.random() * 10 + 10;
        
// //         droplet.style.width = `${size}px`;
// //         droplet.style.height = `${size}px`;
// //         droplet.style.left = `${left}vw`;
// //         droplet.style.animationDelay = `${delay}s`;
// //         droplet.style.animationDuration = `${duration}s`;
        
// //         container.appendChild(droplet);
// //       }
// //     };

// //     const createPipes = () => {
// //       const container = dashboardRef.current;
// //       if (!container) return;
      
// //       const pipeCount = 3;
      
// //       for (let i = 0; i < pipeCount; i++) {
// //         const pipe = document.createElement('div');
// //         pipe.classList.add('pipe-animation');
        
// //         const top = Math.random() * 100;
// //         const width = Math.random() * 200 + 100;
// //         const delay = Math.random() * 3;
// //         const duration = Math.random() * 20 + 10;
        
// //         pipe.style.top = `${top}vh`;
// //         pipe.style.width = `${width}px`;
// //         pipe.style.animationDelay = `${delay}s`;
// //         pipe.style.animationDuration = `${duration}s`;
        
// //         container.appendChild(pipe);
// //       }
// //     };

// //     const createBubbles = () => {
// //       const container = dashboardRef.current;
// //       if (!container) return;
      
// //       const bubbleCount = Math.floor(window.innerWidth / 15);
      
// //       for (let i = 0; i < bubbleCount; i++) {
// //         const bubble = document.createElement('div');
// //         bubble.classList.add('bubble');
        
// //         const size = Math.random() * 15 + 5;
// //         const left = Math.random() * 100;
// //         const top = Math.random() * 100;
// //         const delay = Math.random() * 5;
// //         const duration = Math.random() * 10 + 5;
        
// //         bubble.style.width = `${size}px`;
// //         bubble.style.height = `${size}px`;
// //         bubble.style.left = `${left}vw`;
// //         bubble.style.top = `${top}vh`;
// //         bubble.style.animationDelay = `${delay}s`;
// //         bubble.style.animationDuration = `${duration}s`;
        
// //         container.appendChild(bubble);
// //       }
// //     };

// //     const initAnimations = () => {
// //       const existing = dashboardRef.current.querySelectorAll('.water-droplet, .pipe-animation, .bubble');
// //       existing.forEach(el => el.remove());
// //       createDroplets();
// //       createPipes();
// //       createBubbles();
// //     };

// //     initAnimations();
// //     window.addEventListener('resize', initAnimations);
// //     return () => window.removeEventListener('resize', initAnimations);
// //   }, []);

// //   useEffect(() => {
// //     const fetchDashboardData = async () => {
// //       try {
// //         const [sensorRes, userRes] = await Promise.all([
// //           API.get("/sensor-data"),
// //           API.get("/users"),
// //         ]);

// //         const sensor = sensorRes.data.data || [];
// //         const userList = userRes.data || [];
// //         const uniqueDeviceList = [...new Set(sensor.map((item) => item.device_id))];

// //         // Calculate device status (online/offline) and locations
// //         const statusMap = {};
// //         const locationMap = {};
// //         const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        
// //         uniqueDeviceList.forEach(deviceId => {
// //           const deviceData = sensor.filter(d => d.device_id === deviceId);
// //           const latestData = deviceData.reduce((latest, current) => 
// //             new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
// //           );
          
// //           statusMap[deviceId] = new Date(latestData.createdAt) > oneHourAgo ? "online" : "offline";
          
// //           // Extract location data
// //           const lat = latestData.latitude || latestData.lat;
// //           const lng = latestData.longitude || latestData.lng || latestData.lon;
          
// //           if (lat && lng && lat !== 'NA' && lng !== 'NA' && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
// //             const parsedLat = parseFloat(lat);
// //             const parsedLng = parseFloat(lng);
            
// //             // Only include valid geographic coordinates
// //             if (parsedLat >= -90 && parsedLat <= 90 && parsedLng >= -180 && parsedLng <= 180) {
// //               locationMap[deviceId] = {
// //                 lat: parsedLat,
// //                 lng: parsedLng,
// //                 device_location: latestData.device_location || 'Unknown Location',
// //                 device_site_name: latestData.device_site_name || 'Unknown Site'
// //               };
// //             }
// //           }
// //         });

// //         // Calculate user growth percentage (monthly)
// //         const currentMonth = new Date().getMonth();
// //         const currentYear = new Date().getFullYear();
// //         const prevMonthUsers = userList.filter(user => {
// //           const userDate = new Date(user.createdAt);
// //           return userDate.getMonth() === (currentMonth === 0 ? 11 : currentMonth - 1) && 
// //                  userDate.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear);
// //         }).length;
        
// //         const growthPercentage = prevMonthUsers > 0 
// //           ? Math.round(((userList.length - prevMonthUsers) / prevMonthUsers) * 100)
// //           : userList.length > 0 ? 100 : 0;

// //         setSensorData(sensor);
// //         setUsers(userList);
// //         setUniqueDevices(uniqueDeviceList);
// //         setDeviceStatus(statusMap);
// //         setDeviceLocations(locationMap);
// //         setUserGrowth(growthPercentage);

// //       } catch (error) {
// //         console.error("Error loading dashboard data:", error);
// //       }
// //     };

// //     fetchDashboardData();
// //     const interval = setInterval(fetchDashboardData, 30000);
// //     return () => clearInterval(interval);
// //   }, []);

// //   const recentSensorData = [...sensorData]
// //     .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
// //     .slice(-10);

// //   const timeDeviceMap = {};
// //   recentSensorData.forEach(item => {
// //     const timeKey = `${new Date(item.createdAt).toLocaleDateString()} ${new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
// //     timeDeviceMap[timeKey] = item.device_id;
// //   });

// //   const lineChartData = recentSensorData.map((item) => ({
// //     time: `${new Date(item.createdAt).toLocaleDateString()} ${new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
// //     ...(item.data1 !== undefined && { data1: item.data1 }),
// //     ...(item.data2 !== undefined && { data2: item.data2 }),
// //     ...(item.data3 !== undefined && { data3: item.data3 }),
// //     ...(item.data4 !== undefined && { data4: item.data4 }),
// //     ...(item.data5 !== undefined && { data5: item.data5 }),
// //     ...(item.data6 !== undefined && { data6: item.data6 }),
// //     device_id: item.device_id
// //   }));

// //   // Count online and offline devices
// //   const onlineDevices = Object.entries(deviceStatus)
// //     .filter(([_, status]) => status === "online")
// //     .map(([deviceId]) => deviceId);
  
// //   const offlineDevices = Object.entries(deviceStatus)
// //     .filter(([_, status]) => status === "offline")
// //     .map(([deviceId]) => deviceId);

// //   const onlineDevicesCount = onlineDevices.length;
// //   const offlineDevicesCount = offlineDevices.length;
// //   const totalDevicesCount = uniqueDevices.length;

// //   // Get devices with valid locations
// //   const devicesWithLocations = Object.entries(deviceLocations)
// //     .filter(([deviceId]) => uniqueDevices.includes(deviceId))
// //     .map(([deviceId, location]) => ({
// //       deviceId,
// //       ...location,
// //       status: deviceStatus[deviceId] || 'offline'
// //     }));

// //   // Count devices without coordinates
// //   const devicesWithoutCoordinates = uniqueDevices.filter(deviceId => 
// //     !devicesWithLocations.some(device => device.deviceId === deviceId)
// //   );

// //   // Calculate map center based on device locations or use default
// //   const calculateMapCenter = () => {
// //     if (devicesWithLocations.length === 0) {
// //       return [20.5937, 78.9629]; // Default to India center
// //     }
    
// //     const validLocations = devicesWithLocations.filter(device => 
// //       !isNaN(device.lat) && !isNaN(device.lng)
// //     );
    
// //     if (validLocations.length === 0) {
// //       return [20.5937, 78.9629]; // Default to India center
// //     }
    
// //     const avgLat = validLocations.reduce((sum, device) => sum + device.lat, 0) / validLocations.length;
// //     const avgLng = validLocations.reduce((sum, device) => sum + device.lng, 0) / validLocations.length;
    
// //     return [avgLat, avgLng];
// //   };

// //   const mapCenter = calculateMapCenter();

// //   // Custom Line Chart Tooltip
// //   const LineTooltip = ({ active, payload, label }) => {
// //     if (active && payload && payload.length) {
// //       return (
// //         <div className="custom-tooltip">
// //           <p style={{ 
// //             fontWeight: 'bold',
// //             color: '#00d4ff',
// //             borderBottom: '1px solid rgba(0, 212, 255, 0.3)',
// //             paddingBottom: '5px',
// //             marginBottom: '10px'
// //           }}>
// //             {label}
// //           </p>
// //           <p style={{ color: '#94a3b8', marginBottom: '15px' }}>
// //             Device: {timeDeviceMap[label] || 'Unknown'}
// //           </p>
// //           {payload.map((entry, index) => (
// //             <div key={`item-${index}`} style={{ 
// //               display: 'flex',
// //               alignItems: 'center',
// //               margin: '5px 0'
// //             }}>
// //               <div style={{
// //                 width: '10px',
// //                 height: '10px',
// //                 backgroundColor: entry.color,
// //                 borderRadius: '2px',
// //                 marginRight: '8px'
// //               }} />
// //               <span style={{ color: entry.color }}>
// //                 {entry.name}: <strong>{entry.value}</strong>
// //               </span>
// //             </div>
// //           ))}
// //         </div>
// //       );
// //     }
// //     return null;
// //   };

// //   return (
// //     <div className="dashboard-container" ref={dashboardRef}>
// //       <div className="dashboard-content">
// //         <div className="dashboard-header">
// //           <h2 className="dashboard-title">FLOW METER ANALYTICS</h2>
// //         </div>

// //         <div className="dashboard-stats">
// //           <div className="stat-box">
// //             <div className="stat-icon">🌊</div>
// //             <p className="stat-label">Sensor Entries</p>
// //             <p className="stat-value">{sensorData.length}</p>
// //             <p className="stat-unit">readings</p>
// //           </div>
          
// //           <div className="stat-box" onClick={() => setShowOnlineDevices(true)}>
// //             <div className="stat-icon">⚡</div>
// //             <p className="stat-label">Online Devices</p>
// //             <p className="stat-value">{onlineDevicesCount}</p>
// //             <div className="valve-status valve-open">
// //               Click to view
// //             </div>
// //           </div>
          
// //           <div className="stat-box" onClick={() => setShowOfflineDevices(true)}>
// //             <div className="stat-icon">🔧</div>
// //             <p className="stat-label">Offline Devices</p>
// //             <p className="stat-value">{offlineDevicesCount}</p>
// //             <div className="valve-status valve-closed">
// //               Click to view
// //             </div>
// //           </div>
          
// //           <div className="stat-box">
// //             <div className="stat-icon">👨‍💼</div>
// //             <p className="stat-label">System Users</p>
// //             <p className="stat-value">{users.length}</p>
// //             <p className="stat-trend" style={{ color: userGrowth >= 0 ? '#6ee7b7' : '#ef4444' }}>
// //               {userGrowth >= 0 ? '📈' : '📉'} {Math.abs(userGrowth)}%
// //             </p>
// //           </div>
// //         </div>

// //         {/* Online Devices Popup */}
// //         {showOnlineDevices && (
// //           <div className="devices-popup">
// //             <div className="devices-popup-content">
// //               <h3>Online Devices ({onlineDevicesCount})</h3>
// //               <div className="devices-list">
// //                 {onlineDevices.length > 0 ? (
// //                   <ul>
// //                     {onlineDevices.map(deviceId => (
// //                       <li key={deviceId}>
// //                         <span className="device-status-indicator online"></span>
// //                         {deviceId}
// //                         {deviceLocations[deviceId] && (
// //                           <span className="device-location">
// //                             - {deviceLocations[deviceId].device_location}
// //                           </span>
// //                         )}
// //                       </li>
// //                     ))}
// //                   </ul>
// //                 ) : (
// //                   <p>No online devices</p>
// //                 )}
// //               </div>
// //               <button 
// //                 onClick={() => setShowOnlineDevices(false)}
// //                 className="close-popup-button"
// //               >
// //                 Close
// //               </button>
// //             </div>
// //           </div>
// //         )}

// //         {/* Offline Devices Popup */}
// //         {showOfflineDevices && (
// //           <div className="devices-popup">
// //             <div className="devices-popup-content">
// //               <h3>Offline Devices ({offlineDevicesCount})</h3>
// //               <div className="devices-list">
// //                 {offlineDevices.length > 0 ? (
// //                   <ul>
// //                     {offlineDevices.map(deviceId => (
// //                       <li key={deviceId}>
// //                         <span className="device-status-indicator offline"></span>
// //                         {deviceId}
// //                         {deviceLocations[deviceId] && (
// //                           <span className="device-location">
// //                             - {deviceLocations[deviceId].device_location}
// //                           </span>
// //                         )}
// //                       </li>
// //                     ))}
// //                   </ul>
// //                 ) : (
// //                   <p>No offline devices</p>
// //                 )}
// //               </div>
// //               <button 
// //                 onClick={() => setShowOfflineDevices(false)}
// //                 className="close-popup-button"
// //               >
// //                 Close
// //               </button>
// //             </div>
// //           </div>
// //         )}

// //         <div className="chart-section">
// //           <h3 className="chart-title">DEVICE LOCATIONS & FLOW METRICS</h3>
// //           <div className="charts-wrapper">
// //             <div className="chart-container map-container">
// //               <h4 className="chart-subtitle">
// //                 <span className="flow-indicator" />
// //                 Device Locations
// //                 <span className="map-legend">
// //                   <span className="legend-item">
// //                     <span className="legend-color online"></span>
// //                     Online
// //                   </span>
// //                   <span className="legend-item">
// //                     <span className="legend-color offline"></span>
// //                     Offline
// //                   </span>
// //                 </span>
// //               </h4>
// //               {devicesWithLocations.length > 0 ? (
// //                 <div className="map-wrapper">
// //                   <MapContainer
// //                     center={mapCenter}
// //                     zoom={10}
// //                     style={{ height: '350px', width: '100%', borderRadius: '8px' }}
// //                     className="device-map"
// //                   >
// //                     <TileLayer
// //                       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //                       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //                     />
// //                     {devicesWithLocations.map((device) => (
// //                       <Marker
// //                         key={device.deviceId}
// //                         position={[device.lat, device.lng]}
// //                         icon={device.status === 'online' ? onlineIcon : offlineIcon}
// //                       >
// //                         <MapTooltip permanent={false} direction="top" offset={[0, -20]} opacity={0.9}>
// //                           <div className="map-tooltip">
// //                             {device.deviceId}
// //                           </div>
// //                         </MapTooltip>
// //                         <Popup>
// //                           <div className="device-popup">
// //                             <h4>{device.deviceId}</h4>
// //                             <p><strong>Status:</strong> 
// //                               <span className={`status-text ${device.status}`}>
// //                                 {device.status.toUpperCase()}
// //                               </span>
// //                             </p>
// //                             <p><strong>Location:</strong> {device.device_location}</p>
// //                             <p><strong>Site:</strong> {device.device_site_name}</p>
// //                             <p><strong>Coordinates:</strong> {device.lat.toFixed(6)}, {device.lng.toFixed(6)}</p>
// //                           </div>
// //                         </Popup>
// //                       </Marker>
// //                     ))}
// //                   </MapContainer>
// //                 </div>
// //               ) : (
// //                 <div className="no-data-map">
// //                   <p>No device location data available</p>
// //                   <div className="no-coordinates-popup">
// //                     <h4>Device Location Not Mapped</h4>
// //                     <p>{devicesWithoutCoordinates.length} devices are not showing on the map because their coordinates are not available.</p>
// //                     <p>Please update device locations in the User Management section to see them on the map.</p>
// //                   </div>
// //                   <div className="map-placeholder">
// //                     <MapContainer
// //                       center={[20.5937, 78.9629]}
// //                       zoom={3}
// //                       style={{ height: '350px', width: '100%', borderRadius: '8px', opacity: 0.3 }}
// //                     >
// //                       <TileLayer
// //                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //                         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //                       />
// //                     </MapContainer>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             <div className="chart-container">
// //               <h4 className="chart-subtitle">
// //                 <span className="flow-indicator" />
// //                 Flow Channel Trends
// //               </h4>
// //               {lineChartData.length > 0 ? (
// //                 <ResponsiveContainer width="100%" height={350}>
// //                   <LineChart data={lineChartData}>
// //                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
// //                     <XAxis 
// //                       dataKey="time" 
// //                       stroke="#94a3b8"
// //                       tick={{ fontSize: 12 }}
// //                     />
// //                     <YAxis 
// //                       stroke="#94a3b8"
// //                       tick={{ fontSize: 12 }}
// //                     />
// //                     <Tooltip 
// //                       content={<LineTooltip />}
// //                       contentStyle={{
// //                         background: 'rgba(22, 22, 34, 0.95)',
// //                         border: '1px solid rgba(0, 212, 255, 0.3)',
// //                         borderRadius: '8px',
// //                         padding: '12px',
// //                         backdropFilter: 'blur(8px)'
// //                       }}
// //                     />
// //                     <Legend 
// //                       formatter={(value, entry) => (
// //                         <span style={{ color: entry.color, display: 'flex', alignItems: 'center' }}>
// //                           <span style={{
// //                             display: 'inline-block',
// //                             width: '10px',
// //                             height: '10px',
// //                             background: entry.color,
// //                             borderRadius: '2px',
// //                             marginRight: '8px'
// //                           }} />
// //                           {value}
// //                         </span>
// //                       )}
// //                       wrapperStyle={{ paddingTop: '10px' }}
// //                     />
// //                     {lineColors.map((color, idx) => (
// //                       lineChartData.some(item => item[`data${idx + 1}`] !== undefined) && (
// //                         <Line
// //                           key={`line-${idx}`}
// //                           type="monotone"
// //                           dataKey={`data${idx + 1}`}
// //                           name={`Channel ${idx + 1}`}
// //                           stroke={color}
// //                           strokeWidth={2}
// //                           dot={{ r: 3 }}
// //                           activeDot={{ 
// //                             r: 6,
// //                             stroke: color,
// //                             strokeWidth: 2,
// //                             fill: 'rgba(22, 22, 34, 0.8)'
// //                           }}
// //                           animationDuration={1000}
// //                         />
// //                       )
// //                     ))}
// //                   </LineChart>
// //                 </ResponsiveContainer>
// //               ) : (
// //                 <p>No trend data available</p>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;
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
//   const dashboardRef = useRef(null);

//   // Animation effects
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

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
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
//         const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        
//         uniqueDeviceList.forEach(deviceId => {
//           const deviceData = sensor.filter(d => d.device_id === deviceId);
//           const latestData = deviceData.reduce((latest, current) => 
//             new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
//           );
          
//           statusMap[deviceId] = new Date(latestData.createdAt) > oneHourAgo ? "online" : "offline";
          
//           // Extract location data
//           const lat = latestData.latitude || latestData.lat;
//           const lng = latestData.longitude || latestData.lng || latestData.lon;
          
//           if (lat && lng && lat !== 'NA' && lng !== 'NA' && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
//             const parsedLat = parseFloat(lat);
//             const parsedLng = parseFloat(lng);
            
//             // Only include valid geographic coordinates
//             if (parsedLat >= -90 && parsedLat <= 90 && parsedLng >= -180 && parsedLng <= 180) {
//               locationMap[deviceId] = {
//                 lat: parsedLat,
//                 lng: parsedLng,
//                 device_location: latestData.device_location || 'Unknown Location',
//                 device_site_name: latestData.device_site_name || 'Unknown Site'
//               };
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
//     const interval = setInterval(fetchDashboardData, 30000);
//     return () => clearInterval(interval);
//   }, []);

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

//   // Get devices with valid locations
//   const devicesWithLocations = Object.entries(deviceLocations)
//     .filter(([deviceId]) => uniqueDevices.includes(deviceId))
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

//   // Custom Line Chart Tooltip
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
//         </div>

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
//                           </span>
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
//                           </span>
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

//         <div className="chart-section">
//           <h3 className="chart-title">DEVICE LOCATIONS & FLOW METRICS</h3>
//           <div className="charts-wrapper">
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
//               {devicesWithLocations.length === 0 && (
//                 <div className="map-info">
//                   <p>No devices with location data available</p>
//                 </div>
//               )}
//             </div>

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

import React, { useEffect, useState, useRef } from "react";
import API from "../services/api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup, Tooltip as MapTooltip } from 'react-leaflet';
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

// Custom icons for online/offline devices with better design
const createCustomIcon = (status) => {
  const color = status === 'online' ? '#10b981' : '#ef4444';
  const symbol = status === 'online' ? '🟢' : '🔴';
  
  return new L.DivIcon({
    html: `
      <div class="custom-marker ${status}">
        <div class="marker-pulse"></div>
        <div class="marker-icon">${symbol}</div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

const onlineIcon = createCustomIcon('online');
const offlineIcon = createCustomIcon('offline');

const lineColors = ["#00d4ff", "#0066ff", "#6ee7b7", "#3b82f6", "#8b5cf6", "#ec4899"];

const Dashboard = () => {
  const [sensorData, setSensorData] = useState([]);
  const [users, setUsers] = useState([]);
  const [uniqueDevices, setUniqueDevices] = useState([]);
  const [deviceStatus, setDeviceStatus] = useState({});
  const [deviceLocations, setDeviceLocations] = useState({});
  const [userGrowth, setUserGrowth] = useState(0);
  const [showOnlineDevices, setShowOnlineDevices] = useState(false);
  const [showOfflineDevices, setShowOfflineDevices] = useState(false);
  const [allDevices, setAllDevices] = useState([]);
  const dashboardRef = useRef(null);

  // Fetch all devices with coordinates from the API
  const fetchAllDevices = async () => {
    try {
      const response = await fetch('http://13.201.156.32:5000/api/sensor-data/devices/all');
      const data = await response.json();
      setAllDevices(data.devices || []);
      return data.devices || [];
    } catch (error) {
      console.error("Error fetching devices:", error);
      return [];
    }
  };

  // Animation effects (water droplets, pipes, bubbles)
  useEffect(() => {
    const createDroplets = () => {
      const container = dashboardRef.current;
      if (!container) return;
      
      const dropletCount = Math.floor(window.innerWidth / 20);
      
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
      }
    };

    const createPipes = () => {
      const container = dashboardRef.current;
      if (!container) return;
      
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
      }
    };

    const createBubbles = () => {
      const container = dashboardRef.current;
      if (!container) return;
      
      const bubbleCount = Math.floor(window.innerWidth / 15);
      
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
      }
    };

    const initAnimations = () => {
      const existing = dashboardRef.current.querySelectorAll('.water-droplet, .pipe-animation, .bubble');
      existing.forEach(el => el.remove());
      createDroplets();
      createPipes();
      createBubbles();
    };

    initAnimations();
    window.addEventListener('resize', initAnimations);
    return () => window.removeEventListener('resize', initAnimations);
  }, []);

  // Data fetching and processing
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all devices first
        const devicesFromApi = await fetchAllDevices();
        
        const [sensorRes, userRes] = await Promise.all([
          API.get("/sensor-data"),
          API.get("/users"),
        ]);

        const sensor = sensorRes.data.data || [];
        const userList = userRes.data || [];
        const uniqueDeviceList = [...new Set(sensor.map((item) => item.device_id))];

        // Calculate device status (online/offline) and locations
        const statusMap = {};
        const locationMap = {};
        
        // Get today's date for daily online status check
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        uniqueDeviceList.forEach(deviceId => {
          const deviceData = sensor.filter(d => d.device_id === deviceId);
          
          // Check if device has any data from today - if yes, it's online
          const hasDataToday = deviceData.some(item => {
            const itemDate = new Date(item.createdAt);
            return itemDate >= todayStart;
          });
          
          // If device has any data from today, mark as online, otherwise offline
          statusMap[deviceId] = hasDataToday ? "online" : "offline";
          
          // Find device in the API response to get coordinates
          const deviceFromApi = devicesFromApi.find(device => device.device_id === deviceId);
          
          if (deviceFromApi) {
            const lat = deviceFromApi.latitude;
            const lng = deviceFromApi.longitude;
            
            // Check if coordinates are valid and not "NA"
            if (lat && lng && lat !== 'NA' && lng !== 'NA' && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
              const parsedLat = parseFloat(lat);
              const parsedLng = parseFloat(lng);
              
              // Only include valid geographic coordinates
              if (parsedLat >= -90 && parsedLat <= 90 && parsedLng >= -180 && parsedLng <= 180) {
                locationMap[deviceId] = {
                  lat: parsedLat,
                  lng: parsedLng,
                  device_location: deviceFromApi.device_location || 'Unknown Location',
                  device_site_name: deviceFromApi.device_site_name || 'Unknown Site',
                  device_name: deviceFromApi.device_name || 'Unknown Device'
                };
              }
            }
          }
        });

        // Calculate user growth percentage (monthly)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const prevMonthUsers = userList.filter(user => {
          const userDate = new Date(user.createdAt);
          return userDate.getMonth() === (currentMonth === 0 ? 11 : currentMonth - 1) && 
                 userDate.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear);
        }).length;
        
        const growthPercentage = prevMonthUsers > 0 
          ? Math.round(((userList.length - prevMonthUsers) / prevMonthUsers) * 100)
          : userList.length > 0 ? 100 : 0;

        setSensorData(sensor);
        setUsers(userList);
        setUniqueDevices(uniqueDeviceList);
        setDeviceStatus(statusMap);
        setDeviceLocations(locationMap);
        setUserGrowth(growthPercentage);

      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    fetchDashboardData();
    // Poll for new data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Data transformations for rendering
  const recentSensorData = [...sensorData]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(-10);

  const timeDeviceMap = {};
  recentSensorData.forEach(item => {
    const timeKey = `${new Date(item.createdAt).toLocaleDateString()} ${new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    timeDeviceMap[timeKey] = item.device_id;
  });

  const lineChartData = recentSensorData.map((item) => ({
    time: `${new Date(item.createdAt).toLocaleDateString()} ${new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    ...(item.data1 !== undefined && { data1: item.data1 }),
    ...(item.data2 !== undefined && { data2: item.data2 }),
    ...(item.data3 !== undefined && { data3: item.data3 }),
    ...(item.data4 !== undefined && { data4: item.data4 }),
    ...(item.data5 !== undefined && { data5: item.data5 }),
    ...(item.data6 !== undefined && { data6: item.data6 }),
    device_id: item.device_id
  }));

  // Count online and offline devices
  const onlineDevices = Object.entries(deviceStatus)
    .filter(([_, status]) => status === "online")
    .map(([deviceId]) => deviceId);
  
  const offlineDevices = Object.entries(deviceStatus)
    .filter(([_, status]) => status === "offline")
    .map(([deviceId]) => deviceId);

  const onlineDevicesCount = onlineDevices.length;
  const offlineDevicesCount = offlineDevices.length;
  const totalDevicesCount = uniqueDevices.length;

  // Get devices with valid locations from the API data
  const devicesWithLocations = Object.entries(deviceLocations)
    .filter(([deviceId, location]) => {
      // Ensure we have valid coordinates and the device exists
      return location && 
             location.lat && 
             location.lng && 
             location.lat !== 'NA' && 
             location.lng !== 'NA' &&
             !isNaN(location.lat) && 
             !isNaN(location.lng) &&
             uniqueDevices.includes(deviceId);
    })
    .map(([deviceId, location]) => ({
      deviceId,
      ...location,
      status: deviceStatus[deviceId] || 'offline'
    }));

  // Calculate map center based on device locations or use default
  const calculateMapCenter = () => {
    if (devicesWithLocations.length === 0) {
      return [20.5937, 78.9629]; // Default to India center
    }
    
    const validLocations = devicesWithLocations.filter(device => 
      !isNaN(device.lat) && !isNaN(device.lng)
    );
    
    if (validLocations.length === 0) {
      return [20.5937, 78.9629]; // Default to India center
    }
    
    const avgLat = validLocations.reduce((sum, device) => sum + device.lat, 0) / validLocations.length;
    const avgLng = validLocations.reduce((sum, device) => sum + device.lng, 0) / validLocations.length;
    
    return [avgLat, avgLng];
  };

  const mapCenter = calculateMapCenter();

  // Custom Line Chart Tooltip Component
  const LineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
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
            Device: {timeDeviceMap[label] || 'Unknown'}
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
                {entry.name}: <strong>{entry.value}</strong>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container" ref={dashboardRef}>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2 className="dashboard-title">FLOW METER ANALYTICS</h2>
          {/* <div className="device-summary">
            Total Devices: {totalDevicesCount} | 
            With Locations: {devicesWithLocations.length} | 
            Online: {onlineDevicesCount} | 
            Offline: {offlineDevicesCount} */}
          {/* </div> */}
        </div>

        {/* Statistics Boxes */}
        <div className="dashboard-stats">
          <div className="stat-box">
            <div className="stat-icon">🌊</div>
            <p className="stat-label">Sensor Entries</p>
            <p className="stat-value">{sensorData.length}</p>
            <p className="stat-unit">readings</p>
          </div>
          
          <div className="stat-box" onClick={() => setShowOnlineDevices(true)}>
            <div className="stat-icon">⚡</div>
            <p className="stat-label">Online Devices</p>
            <p className="stat-value">{onlineDevicesCount}</p>
            <div className="valve-status valve-open">
              Click to view
            </div>
          </div>
          
          <div className="stat-box" onClick={() => setShowOfflineDevices(true)}>
            <div className="stat-icon">🔧</div>
            <p className="stat-label">Offline Devices</p>
            <p className="stat-value">{offlineDevicesCount}</p>
            <div className="valve-status valve-closed">
              Click to view
            </div>
          </div>
          
          <div className="stat-box">
            <div className="stat-icon">👨‍💼</div>
            <p className="stat-label">System Users</p>
            <p className="stat-value">{users.length}</p>
            <p className="stat-trend" style={{ color: userGrowth >= 0 ? '#6ee7b7' : '#ef4444' }}>
              {userGrowth >= 0 ? '📈' : '📉'} {Math.abs(userGrowth)}%
            </p>
          </div>
        </div>

        {/* Online Devices Popup */}
        {showOnlineDevices && (
          <div className="devices-popup">
            <div className="devices-popup-content">
              <h3>Online Devices ({onlineDevicesCount})</h3>
              <div className="devices-list">
                {onlineDevices.length > 0 ? (
                  <ul>
                    {onlineDevices.map(deviceId => (
                      <li key={deviceId}>
                        <span className="device-status-indicator online"></span>
                        {deviceId}
                        {deviceLocations[deviceId] && (
                          <span className="device-location">
                            - {deviceLocations[deviceId].device_location} 
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
                  <p>No online devices</p>
                )}
              </div>
              <button 
                onClick={() => setShowOnlineDevices(false)}
                className="close-popup-button"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Offline Devices Popup */}
        {showOfflineDevices && (
          <div className="devices-popup">
            <div className="devices-popup-content">
              <h3>Offline Devices ({offlineDevicesCount})</h3>
              <div className="devices-list">
                {offlineDevices.length > 0 ? (
                  <ul>
                    {offlineDevices.map(deviceId => (
                      <li key={deviceId}>
                        <span className="device-status-indicator offline"></span>
                        {deviceId}
                        {deviceLocations[deviceId] && (
                          <span className="device-location">
                            - {deviceLocations[deviceId].device_location}
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
                  <p>No offline devices</p>
                )}
              </div>
              <button 
                onClick={() => setShowOfflineDevices(false)}
                className="close-popup-button"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Charts and Map Section */}
        <div className="chart-section">
          <h3 className="chart-title">DEVICE LOCATIONS & FLOW METRICS</h3>
          <div className="charts-wrapper">
            
            {/* Map Container */}
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
                <MapContainer
                  center={mapCenter}
                  zoom={devicesWithLocations.length > 0 ? 10 : 3}
                  style={{ height: '350px', width: '100%', borderRadius: '8px' }}
                  className="device-map"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {devicesWithLocations.map((device) => (
                    <Marker
                      key={device.deviceId}
                      position={[device.lat, device.lng]}
                      icon={device.status === 'online' ? onlineIcon : offlineIcon}
                    >
                      <MapTooltip permanent={false} direction="top" offset={[0, -20]} opacity={0.9}>
                        <div className="map-tooltip">
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
              </div>
              {/* Map fallback information */}
              {devicesWithLocations.length === 0 && (
                <div className="map-info">
                  <p>No devices with location data available</p>
                  <p className="map-info-subtitle">
                    {totalDevicesCount} devices found, but none have valid GPS coordinates configured
                  </p>
                </div>
              )}
            </div>

            {/* Line Chart Container */}
            <div className="chart-container">
              <h4 className="chart-subtitle">
                <span className="flow-indicator" />
                Flow Channel Trends
              </h4>
              {lineChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#94a3b8"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      tick={{ fontSize: 12 }}
                    />
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
                          animationDuration={1000}
                        />
                      )
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p>No trend data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;