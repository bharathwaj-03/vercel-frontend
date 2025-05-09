import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StaffSidebar from './StaffSidebar';

import "./Meetings.css";
import { UserContext } from './UserContext';

function Meetings() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);

  // Sample meetings data - you can edit these later
  useEffect(() => {
    // This would normally be an API call
    const sampleMeetings = [
      {
        id: 1,
        title: "Innovatex Club Meeting",
        date: "2025-05-03",
        time: "10:00 AM - 11:30 AM",
        location: "Student Activity Center",
        type: "club",
        status: "upcoming"
      },
      {
        id: 2,
        title: "Midterm Exam Committee",
        date: "2025-04-04",
        time: "1:00 PM - 2:30 PM",
        location: "Conference Room A",
        type: "exam",
        status: "completed"
      },
      {
        id: 3,
        title: "Department Staff Meeting",
        date: "2025-05-05",
        time: "11:00 AM - 12:00 PM",
        location: "Faculty Lounge",
        type: "staff",
        status: "upcoming"
      },
      {
        id: 4,
        title: "Paper Setting for Finals",
        date: "2025-05-06",
        time: "2:00 PM - 4:00 PM",
        location: "Conference Room B",
        type: "exam",
        status: "upcoming"
      },
      {
        id: 5,
        title: "Curriculum Committee",
        date: "2025-05-01",
        time: "10:30 AM - 12:00 PM",
        location: "Dean's Office",
        type: "staff",
        status: "completed"
      },
      {
        id: 6,
        title: "End Term Exam Coordination",
        date: "2025-05-10",
        time: "3:00 PM - 4:00 PM",
        location: "Conference Room C",
        type: "exam",
        status: "upcoming"
      },
      {
        id: 7,
        title: "Innovatex Event Planning",
        date: "2025-04-28",
        time: "1:00 PM - 2:00 PM",
        location: "Student Center",
        type: "club",
        status: "completed"
      },
      {
        id: 8,
        title: "Faculty Development Program",
        date: "2025-05-08",
        time: "10:00 AM - 12:00 PM",
        location: "Auditorium",
        type: "staff",
        status: "upcoming"
      }
    ];
    
    setMeetings(sampleMeetings);
  }, []);

  const getMeetingClass = (type, status) => {
    if (status === "completed") {
      return "meeting-completed";
    }
    
    switch (type) {
      case "exam":
        return "meeting-exam";
      case "club":
        return "meeting-club";
      case "staff":
        return "meeting-staff";
      default:
        return "";
    }
  };

  function handleLogout() {
    navigate("/");
  }

  return (
    <div className='attendance-container'>
      <div className="dash-cont">
        <StaffSidebar onLogout={handleLogout} />
      </div>
      <div className="main-content4">
        <div className='header'>
          <h1>Meetings Scheduled</h1>
        </div>
        
        <div className="meeting-container">
          <div className="meetings-legend">
            <div className="legend-item">
              <div className="legend-color meeting-exam"></div>
              <span>Exam Related</span>
            </div>
            <div className="legend-item">
              <div className="legend-color meeting-staff"></div>
              <span>Staff Meetings</span>
            </div>
            <div className="legend-item">
              <div className="legend-color meeting-club"></div>
              <span>Club Meetings</span>
            </div>
            <div className="legend-item">
              <div className="legend-color meeting-completed"></div>
              <span>Completed</span>
            </div>
          </div>
          
          <div className="meetings-list">
            {meetings.map((meeting) => (
              <div 
                key={meeting.id} 
                className={`meeting-box ${getMeetingClass(meeting.type, meeting.status)}`}
              >
                <h3>{meeting.title}</h3>
                <p className="meeting-date">{meeting.date}</p>
                <p className="meeting-time">{meeting.time}</p>
                <p className="meeting-location">{meeting.location}</p>
                <div className="meeting-status">
                  {meeting.status === "completed" ? "Completed" : "Upcoming"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Meetings;