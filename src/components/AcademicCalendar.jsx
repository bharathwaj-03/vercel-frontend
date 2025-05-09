import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AcademicCalendar.css';
import Sidebar from './Sidebar';
import axios from "axios";
import { UserContext } from './UserContext';
import { useContext } from 'react';

function AcademicCalendar() {
  const navigate=useNavigate();
  const { user } = useContext(UserContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [academicEvents, setAcademicEvents] = useState([]);
  
  
 

 useEffect(() => {
  loadEvents();
}, []);

async function loadEvents() {
  try {
    console.log("Fetching academic calendar data...");
    
    const result = await axios.get("http://localhost:3000/academic-calendar");
    console.log("API Response received:", result.data);
    
    if (result.data && result.data.success) {
      console.log("Academic events fetched successfully");
      
      // Map holidays from backend to the format your calendar expects
      const formattedHolidays = result.data.holidays.map(holiday => ({
        date: formatDate(new Date(holiday.date)), // Make sure the date is in YYYY-MM-DD format
        name: holiday.name,
        color: holiday.color || '#ff7675' // Use holiday color or default to red
      }));
      
      // Map events from backend to the format your calendar expects
      const formattedEvents = result.data.events.map(event => ({
        date: formatDate(new Date(event.date)), // Make sure the date is in YYYY-MM-DD format
        name: event.name,
        color: event.color || '#fdcb6e' // Use event color or default to yellow
      }));
      
      console.log("Formatted holidays:", formattedHolidays);
      console.log("Formatted events:", formattedEvents);
      
      // Update state with the properly formatted data
      setHolidays(formattedHolidays);
      setAcademicEvents(formattedEvents);
    } else {
      console.log("Couldn't fetch academic events:", result.data.message);
      
      // Keep the sample data as fallback if API fails
      loadSampleData();
    }
  } catch (error) {
    console.error("Error loading events:", error);
    
    // Fall back to sample data if API call fails
    loadSampleData();
  }
}

// Add a separate function to load sample data
function loadSampleData() {
  console.log("Loading sample calendar data");
  
  const sampleHolidays = [
    { date: '2025-05-01', name: 'Labor Day', color: '#ff7675' },
    { date: '2025-05-15', name: 'Founder\'s Day', color: '#74b9ff' },
    { date: '2025-05-25', name: 'Memorial Day', color: '#ff7675' },
    { date: '2025-06-04', name: 'Independence Day', color: '#ff7675' },
    { date: '2025-06-19', name: 'Juneteenth', color: '#ff7675' },
  ];
  
  const sampleEvents = [
    { date: '2025-05-05', name: 'Midterm Week Begins', color: '#fdcb6e' },
    { date: '2025-05-12', name: 'Registration Opens', color: '#55efc4' },
    { date: '2025-05-20', name: 'Final Exams Begin', color: '#e17055' },
    { date: '2025-06-01', name: 'Summer Term Begins', color: '#a29bfe' },
    { date: '2025-06-10', name: 'Faculty Conference', color: '#74b9ff' },
  ];
  
  setHolidays(sampleHolidays);
  setAcademicEvents(sampleEvents);
}

// Update your useEffect to only call loadEvents

  
  // Functions to navigate between months
  const prevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };
  
  const nextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Format date to YYYY-MM-DD for comparison with holiday dates
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Get holidays for a specific date
  const getHolidaysForDate = (date) => {
    const formattedDate = formatDate(date);
    return holidays.filter(holiday => holiday.date === formattedDate);
  };
  
  // Get academic events for a specific date
  const getEventsForDate = (date) => {
    const formattedDate = formatDate(date);
    return academicEvents.filter(event => event.date === formattedDate);
  };
  
  // Generate calendar days for current month view
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    const firstDayOfWeek = firstDay.getDay();
    
    // Total days in the month
    const daysInMonth = lastDay.getDate();
    
    // Array to hold all calendar days
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ date: null, isCurrentMonth: false });
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: formatDate(date) === formatDate(new Date()),
        holidays: getHolidaysForDate(date),
        events: getEventsForDate(date)
      });
    }
    
    return days;
  };
  
  // Get month and year display
  const monthYearDisplay = () => {
    const options = { month: 'long', year: 'numeric' };
    return currentDate.toLocaleDateString(undefined, options);
  };
  
  // Generate weekly headers (Sun, Mon, etc.)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const calendarDays = generateCalendarDays();
  const handleLogout = () => {
    
    navigate("/");
  };
  
  return (
    <div className="dashboard-container">
      <div className="dash-cont">
      <Sidebar onLogout={handleLogout} />
      </div>
  
      <div className="main-content">
        <div className="university-header">
          <img src="./images/logo2.png" alt="Princeton Logo" className="header-logo" />
          <h1>Academic Calendar</h1>
        </div>
        
        <div className="calendar-container">
          <div className="calendar-header">
            <button onClick={prevMonth} className="calendar-nav-btn">
              <i className='bx bx-chevron-left'></i>
            </button>
            <h2>{monthYearDisplay()}</h2>
            <button onClick={nextMonth} className="calendar-nav-btn">
              <i className='bx bx-chevron-right'></i>
            </button>
          </div>
          
          <button onClick={goToToday} className="today-btn">
            Today
          </button>
          
          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#ff7675' }}></div>
              <span>Holiday</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#fdcb6e' }}></div>
              <span>Academic Event</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#55efc4' }}></div>
              <span>Registration</span>
            </div>
          </div>
          
          <div className="calendar-grid">
            {/* Calendar header with weekday names */}
            {weekDays.map((day, index) => (
              <div key={index} className="calendar-weekday">{day}</div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day, index) => (
              <div 
                key={index} 
                className={`calendar-day ${!day.date ? 'empty-day' : ''} ${day.isToday ? 'today' : ''} ${day.isCurrentMonth ? 'current-month' : ''}`}
              >
                {day.date && (
                  <>
                    <div className="day-number">{day.date.getDate()}</div>
                    {day.holidays.length > 0 && (
                      <div className="calendar-events">
                        {day.holidays.map((holiday, i) => (
                          <div 
                            key={`holiday-${i}`} 
                            className="calendar-event holiday"
                            style={{ backgroundColor: holiday.color }}
                          >
                            {holiday.name}
                          </div>
                        ))}
                      </div>
                    )}
                    {day.events.length > 0 && (
                      <div className="calendar-events">
                        {day.events.map((event, i) => (
                          <div 
                            key={`event-${i}`} 
                            className="calendar-event academic"
                            style={{ backgroundColor: event.color }}
                          >
                            {event.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="upcoming-events">
          <h3>Upcoming Events</h3>
          <div className="events-list">
            {[...holidays, ...academicEvents]
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .filter(event => new Date(event.date) >= new Date())
              .slice(0, 5)
              .map((event, index) => (
                <div key={index} className="event-item">
                  <div className="event-date">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="event-name" style={{ borderLeftColor: event.color }}>
                    {event.name}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AcademicCalendar;