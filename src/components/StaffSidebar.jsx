import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from './UserContext';

function StaffSidebar({ onLogout }) {
  const { staff } = useContext(UserContext);
  // const {setStaffs}=useContext(UserContext);
  const staffname = staff?.name;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Toggle sidebar for mobile view
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close sidebar when clicking a link on mobile
  const closeMobileMenu = () => {
    if (window.innerWidth <= 768) {
      setIsMenuOpen(false);
    }
  };

  async function loadClasses() {
    try {
      const result = await axios.post("http://localhost:3000/getclasses", {
        staffname: staffname
      });
  
      if (result.data.success) {
        console.log("Staff classes fetched successfully: ", result.data.classes);
      } else {
        console.log("Failed to fetch staff classes");
      }
    } catch (err) {
      console.error("Frontend Error:", err);
    }
  }


  return (
    <>
      <div className="hamburger-menu" onClick={toggleMenu}>
        <div className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <div className={`sidebar ${isMenuOpen ? 'active' : ''}`}>
        <h2 className="sidebar-title">Dashboard</h2>
        <ul className="sidebar-menu">
          <li>
            <Link to="/homestaff" className='link-no-decoration' onClick={
                
                closeMobileMenu
            }>
              <i className='bx bx-home'></i><span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/classes" className='link-no-decoration' onClick={() => {
              loadClasses();
              closeMobileMenu();
            }}>
              <i className='bx bx-calendar'></i><span>Your Classes</span>
            </Link>
          </li>
          <li>
            <Link to="/mark" className='link-no-decoration' onClick={closeMobileMenu}>
              <i className='bx bx-calendar'></i><span>Mark Attendance</span>
            </Link>
          </li>
          <li>
            <Link to="/academic-calendar2" className='link-no-decoration' onClick={closeMobileMenu}>
              <i className='bx bx-book'></i><span>Academic Calendar</span>
            </Link>
          </li>
          <li>
            <Link to="/meetings" className="link-no-decoration" onClick={closeMobileMenu}>
              <i className='bx bx-check-square'></i><span>Meetings Scheduled</span>
            </Link>
          </li>
        </ul>

        <button className="logout-btn" onClick={onLogout}>
          <i className='bx bx-log-out'></i> Logout
        </button>
      </div>
      
      {isMenuOpen && <div className="sidebar-overlay" onClick={toggleMenu}></div>}
    </>
  );
}

export default StaffSidebar;