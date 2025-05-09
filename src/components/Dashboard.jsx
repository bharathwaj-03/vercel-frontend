import React, { useContext,useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { UserContext } from './UserContext';
import './Dashboard.css';

function Dashboard({onLogout }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      setUserData(user);
    } 
    else{
      navigate("/");
    }
  }, [user,navigate]);


  const handleLogout = () => {
   
    if (onLogout) {
      onLogout();
    } else {
      navigate('/');
    }
  };

  if (!userData) {
    return (
      <div className="loading-container">
        <div className="loading">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dash-cont">
      <Sidebar onLogout={handleLogout} />
      </div>
    

      <div className="main-content">
        <div className="university-header">
          <img src="./images/logo2.png" alt="Princeton Logo" className="header-logo" />
          <h1>Princeton University</h1>
        </div>

        <div className="profile-card">
          <img src="./images/profile.jpg" alt="Profile" className="profile-img" />
          <div className="info">
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>DOB:</strong> {userData.dob}</p>

            {userData.role === 'student' && (
              <>
                <p><strong>Student ID:</strong> {userData.studentId}</p>
                <p><strong>Course:</strong> Btech CSE General</p>
              </>
            )}

      
          </div>
        </div>

        {/* Courses Section */}
        {userData.courses && userData.courses.length > 0 && (
          <div className="courses-section">
            <h2>Your Courses</h2>
            <div className="courses-grid">
              {userData.courses.slice(0, 8).map((course, index) => (
                <div key={index} className="course-box">
                  {course}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
