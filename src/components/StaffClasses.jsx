import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import StaffSidebar from './StaffSidebar';
import axios from "axios";
import "./TimeTable.css";
import { UserContext } from './UserContext';

function StaffClasses() {
  const navigate = useNavigate();
  const { staff } = useContext(UserContext);
  const staffname = staff.name;
  
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // State for current displayed date and classes data
  const [currentDate, setCurrentDate] = useState(new Date());
  const [staffClasses, setStaffClasses] = useState([]);
  const [currentDayClasses, setCurrentDayClasses] = useState(null);
  
  // Helper function to get formatted day name
  const getCurrentDayName = () => days[currentDate.getDay()];
  
  useEffect(() => {
    // Load staff classes when component mounts
    loadStaffClasses();
  }, [staffname]);

  useEffect(() => {
    // Update displayed classes when currentDate changes
    updateCurrentDayClasses();
  }, [currentDate, staffClasses]);

  // Function to fetch all classes for the logged-in staff
  const loadStaffClasses = async () => {
    if (!staffname) return;
    
    try {
      const result = await axios.post("http://localhost:3000/getclasses", {
        staffname: staffname
      });
      
      if (result.data.success) {
        setStaffClasses(result.data.classes);
      } else {
        console.log(result.data.message || "Failed to load staff classes");
        setStaffClasses([]);
      }
    } catch (error) {
      console.error("Error loading staff classes: ", error);
      setStaffClasses([]);
    }
  };

  // Function to update classes for the current selected day
  const updateCurrentDayClasses = () => {
    const dayName = getCurrentDayName();
    const classesForDay = staffClasses.find(item => item.day === dayName);
    setCurrentDayClasses(classesForDay || null);
  };

  // Navigate to previous day
  const navigateToPreviousDay = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(prevDate);
  };

  // Navigate to next day
  const navigateToNextDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDate);
  };

  const handleLogout = () => {
    navigate("/");
  };

  // Format date for display
  const formattedDate = `${getCurrentDayName()}, ${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  return (
    <div className='timetable-container'>
      <div className="dash-cont">
        <StaffSidebar onLogout={handleLogout} />
      </div>
      <div className="main-content3">
        <div className="header">
          <h1>Your Classes For: 6CSE10</h1>
          
          {/* Date slider with navigation arrows */}
          <div className="date-slider">
            <button 
              className="slider-arrow" 
              onClick={navigateToPreviousDay}
              aria-label="Previous day"
            >
              <i className='bx bx-chevron-left'></i>
            </button>
            
            <h3 className="current-date">{formattedDate}</h3>
            
            <button 
              className="slider-arrow" 
              onClick={navigateToNextDay}
              aria-label="Next day"
            >
              <i className='bx bx-chevron-right'></i>
            </button>
          </div>
        </div>

        {!currentDayClasses ? (
          <div className="section">
            <h1>You Have No Classes Today! Enjoy 😊🤙</h1>
          </div>
        ) : (
          (getCurrentDayName() === "Sunday" || getCurrentDayName() === "Saturday") ? (
            <div className="section">
              <h1>You Have No Classes Today! Enjoy 😊🤙</h1>
            </div>
          ) : (
            currentDayClasses.periods && currentDayClasses.periods.length > 0 ? (
              <div className="tt-section">
                <div className='tt-grid'>
                  {currentDayClasses.periods.map((period, index) => (
                    <div key={index} className="tt-box">
                      <h5>{period.time}</h5>
                      <h5>{period.staffId}</h5>
                      <h5>{period.subject}</h5>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="section">
                <h1>No classes scheduled for this day</h1>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

export default StaffClasses;