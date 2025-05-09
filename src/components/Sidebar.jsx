import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from './UserContext';

function Sidebar({ onLogout }) {
  const { setTimeTable, setStaffs } = useContext(UserContext);
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

  async function loadTimeTable() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date();
    const currentDay = days[d.getDay()];

    try {
      const result = await axios.get("http://localhost:3000/getTimeTable", {
        params: { day: currentDay }
      });

      if (result.data.success) {
        console.log("Sidebar.jsx: ", result.data.timetable);
        setTimeTable(result.data.timetable);
      } else {
        console.log(result.data.message || "Failed to load timetable data");
        setTimeTable(null);
      }
    } catch (error) {
      console.error("Error loading timetable: ", error);
      setTimeTable(null);
    }
  }

  async function loadStaffs() {
    try {
      const result = await axios.get("http://localhost:3000/getstaff");
      if (result.data.success) {
        console.log("Staffs: ", result.data.staffs);
        setStaffs(result.data.staffs);
      } else {
        console.log(result.data.message || "Failed to load staff data");
        setStaffs(null);
      }
    } catch (error) {
      console.error("Error loading staffs: ", error);
      setStaffs(null);
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
            <Link to="/home" className='link-no-decoration' onClick={closeMobileMenu}>
              <i className='bx bx-home'></i><span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/timetable" onClick={() => {
              loadTimeTable();
              closeMobileMenu();
            }} className='link-no-decoration'>
              <i className='bx bx-calendar'></i><span>Timetable</span>
            </Link>
          </li>
          <li>
            <Link to="/academic-calendar" className='link-no-decoration' onClick={closeMobileMenu}>
              <i className='bx bx-book'></i><span>Academic Calendar</span>
            </Link>
          </li>
          <li>
            <Link to="/attendance" className='link-no-decoration' onClick={() => {
              loadStaffs();
              closeMobileMenu();
            }}>
              <i className='bx bx-check-square'></i><span>Attendance</span>
            </Link>
          </li>
          <li>
            <Link to="/download" className='link-no-decoration' onClick={closeMobileMenu}>
              <i className='bx bx-download'></i><span>Download Report</span>
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

export default Sidebar;
