// import React, { useState } from 'react';
// import '../styles/Navbar.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars } from '@fortawesome/free-solid-svg-icons';

// const Navbar = ({ onLogout }) => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);

//   const handleLogout = () => {
//     const confirmed = window.confirm('Are you sure you want to logout?');
//     if (confirmed && onLogout) {
//       onLogout();
//     }
//   };

//   const toggleMenu = () => {
//     setMenuOpen(prev => !prev);
//   };

//   return (
//     <nav className="navbar">
//       <div className="nav-left">
//         <span 
//           className="navbar-logo"
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//         >
//           <img 
//             src="/logo.png" 
//             alt="Company Logo" 
//             className={`logo-image ${isHovered ? 'rotate' : ''}`} 
//             onAnimationEnd={() => setIsHovered(false)}
//           />
//         </span>
//       </div>

//       <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
//         <li><a href="/dashboard">Dashboard</a></li>
//         <li><a href="/devices">Devices</a></li>
//         <li><a href="/users">Users</a></li>
//         <li><a href="/tickets">Tickets</a></li>
//         <li className="mobile-only">
//           <button className="logout-btn-inline" onClick={handleLogout}>Logout</button>
//         </li>
//       </ul>

//       <div className="nav-right">
//         <div className="hamburger" onClick={toggleMenu}>
//           <FontAwesomeIcon icon={faBars} />
//         </div>
//         <button className="logout-btn-inline desktop-only" onClick={handleLogout}>
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React, { useState } from 'react';
// 1. Import 'Link' from react-router-dom
import { Link } from 'react-router-dom'; 
import '../styles/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed && onLogout) {
      onLogout();
    }
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <span 
          className="navbar-logo"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img 
            src="/logo.png" 
            alt="Company Logo" 
            className={`logo-image ${isHovered ? 'rotate' : ''}`} 
            onAnimationEnd={() => setIsHovered(false)}
          />
        </span>
      </div>

      <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        {/* 2. Replace <a> with <Link> and href with to */}
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/devices">Devices</Link></li>
        <li><Link to="/users">Users</Link></li>
        {/* The new Alerts link */}
        <li><Link to="/alerts">Alerts</Link></li> 
        <li><Link to="/tickets">Tickets</Link></li>
        <li className="mobile-only">
          <button className="logout-btn-inline" onClick={handleLogout}>Logout</button>
        </li>
      </ul>

      <div className="nav-right">
        <div className="hamburger" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </div>
        <button className="logout-btn-inline desktop-only" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;