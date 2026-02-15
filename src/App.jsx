
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// import Login from './pages/loginform';
// import Dashboard from './pages/Dashboard';
// import Devices from './pages/Devices'; // I assume Devices.jsx exports Dashboard component? You might want to rename for clarity.
// import SingleDeviceSensorData from './pages/SingleDeviceSensorData';
// import UserManagement from './pages/user';
// import Navbar from './components/Navbar';
// import { useParams } from 'react-router-dom';
// import TicketManagement from './pages/Tickets'; // Assuming you have a TicketManagement page


// const ProtectedLayout = ({ onLogout }) => {
//   // This layout will show Navbar + nested routes
//   return (
//     <>
//       <Navbar onLogout={onLogout} />
//       <Routes>
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="devices" element={<Devices />} />
       
//         <Route
//           path="device/:deviceId"
//           element={<SingleDeviceSensorDataWrapper />}
//         />
//         <Route path="users" element={<UserManagement />} />
//         {/* Default to dashboard if no path */}
//         <Route path="*" element={<Navigate to="dashboard" />} />
//         <Route path="tickets" element={<TicketManagement />} />
//       </Routes>
//     </>
//   );
// };

// const SingleDeviceSensorDataWrapper = () => {
//   // Grab deviceId param from URL
//   const { deviceId } = useParams();
//   return <SingleDeviceSensorData deviceId={deviceId} />;
// };

// function App() {
//   // We'll store auth status in state for re-render on login/logout
//   const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));

//   // Handle login success from loginform
//   const handleLoginSuccess = () => {
//     localStorage.setItem('token', 'hardcoded-token-for-now');
//     setIsAuthenticated(true);
//   };

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setIsAuthenticated(false);
//   };

//   return (
//     <Router>
//       <Routes>
//         {/* Public route */}
//         <Route
//           path="/login"
//           element={
//             isAuthenticated ? (
//               <Navigate to="/dashboard" />
//             ) : (
//               <Login onLoginSuccess={handleLoginSuccess} />
//             )
//           }
//         />

//         {/* Protected Routes */}
//         <Route
//           path="/*"
//           element={
//             isAuthenticated ? (
//               <ProtectedLayout onLogout={handleLogout} />
//             ) : (
//               <Navigate to="/login" />
//             )
//           }
//         />
//       </Routes>
      
//     </Router>
    
//   );
// }

// export default App;
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';

import Login from './pages/loginform';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import SingleDeviceSensorData from './pages/SingleDeviceSensorData';
import UserManagement from './pages/user';
import Navbar from './components/Navbar';
import TicketManagement from './pages/Tickets';
import AlertsPage from './pages/AlertsPage'; // Import AlertsPage

const ProtectedLayout = ({ onLogout }) => {
  return (
    <>
      <Navbar onLogout={onLogout} />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/device/:deviceId" element={<SingleDeviceSensorDataWrapper />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/tickets" element={<TicketManagement />} />
        <Route path="/alerts" element={<AlertsPage />} /> {/* Added AlertsPage route */}
        {/* Default to dashboard if no matching path */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
};

const SingleDeviceSensorDataWrapper = () => {
  const { deviceId } = useParams();
  return <SingleDeviceSensorData deviceId={deviceId} />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));

  const handleLoginSuccess = () => {
    localStorage.setItem('token', 'hardcoded-token-for-now');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <ProtectedLayout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
