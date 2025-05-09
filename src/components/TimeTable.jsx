import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import axios from "axios";
import "./TimeTable.css";
import { UserContext } from './UserContext';

function TimeTable() {
  const navigate = useNavigate();
  const { timetable } = useContext(UserContext);
  
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // State for current displayed date and timetable data
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTimetable, setCurrentTimetable] = useState(null);
  
  // Helper function to get formatted day name
  const getCurrentDayName = () => days[currentDate.getDay()];
  
  useEffect(() => {
    if (timetable) {
      setCurrentTimetable(timetable);
    } else {
      console.log("Timetable is null");
    }
  }, [timetable]);

  // Function to fetch timetable for a specific day
  const fetchTimetableForDay = async (dayName) => {
    try {
      const result = await axios.get("http://localhost:3000/getTimeTable", {
        params: { day: dayName }
      });
      
      if (result.data.success) {
        setCurrentTimetable(result.data.timetable);
      } else {
        console.log(result.data.message || "Failed to load timetable data");
        setCurrentTimetable(null);
      }
    } catch (error) {
      console.error("Error loading timetable: ", error);
      setCurrentTimetable(null);
    }
  };

  // Navigate to previous day
  const navigateToPreviousDay = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(prevDate);
    fetchTimetableForDay(days[prevDate.getDay()]);
  };

  // Navigate to next day
  const navigateToNextDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDate);
    fetchTimetableForDay(days[nextDate.getDay()]);
  };

  const handleLogout = () => {
    navigate("/");
  };

  // Format date for display
  const formattedDate = `${getCurrentDayName()}, ${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  return (
    <div className='timetable-container'>
     <div className="dash-cont">
      <Sidebar onLogout={handleLogout} />
      </div>
      <div className="main-content3">
        <div className="header">
          <h1>Time Table</h1>
          
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

        {!currentTimetable ? (
          <div className="section">
            <h1>You Have No Sessions Today! Enjoy 😊🤙</h1>
          </div>
        ) : (
          (getCurrentDayName() === "Sunday" || getCurrentDayName() === "Saturday") ? (
            <div className="section">
              <h1>You Have No Sessions Today! Enjoy 😊🤙</h1>
            </div>
          ) : (
            currentTimetable.periods && currentTimetable.periods.length > 0 ? (
              <div className="tt-section">
                <div className='tt-grid'>
                  {currentTimetable.periods.slice(0, 8).map((period, index) => (
                    <div key={index} className="tt-box">
                      <h5>{period.time}</h5>
                      <h5>{period.staffName}</h5>
                      <h5>{period.subject}</h5>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="section">
                <h1>No sessions available for this day</h1>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

export default TimeTable;