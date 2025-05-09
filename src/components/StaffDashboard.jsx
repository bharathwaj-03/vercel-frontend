import React, { useContext,useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StaffSidebar from './StaffSidebar';
import { UserContext } from './UserContext';
import './Dashboard.css';

function StaffDashboard({onLogout }) {
  const navigate = useNavigate();
  const { staff } = useContext(UserContext);
  const {staffs}=useContext(UserContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (staff) {
      
      setUserData(staff);
    } 
    else{
      navigate("/");
    }
  }, [staff,navigate]);

  // Handle logout
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
      <StaffSidebar onLogout={handleLogout} />
      </div>
    

      <div className="main-content">
        <div className="university-header">
          <img src="./images/logo2.png" alt="Princeton Logo" className="header-logo" />
          <h1>Princeton University</h1>
        </div>

        <div className="profile-card">
          <img src="./images/profile.jpg" alt="Profile" className="profile-img" />
          <div className="info">
            <p><strong>Name:</strong> {staff.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>DOB:</strong> {userData.dob}</p>
            <p><strong>Specialised In:</strong> {userData.course}</p>
            <p><strong>Qualification:</strong> {staffs.qualification}</p>
            <p><strong>Experience in teaching:</strong> {staffs.experience}</p>
            <p><strong>Staff Room:</strong> {staffs.room}</p>
            <p><strong>Address:</strong> {staffs.address}</p>
            <p><strong>Mobile:</strong> {staffs.mobile}</p>

       

            {userData.role === 'staff' && (
              <>
                <p><strong>Staff ID:</strong> {userData.staffId}</p>
                {userData.department && <p><strong>Department:</strong> {userData.department}</p>}
              </>
            )}
          </div>
        </div>

    
      </div>
    </div>
  );
}

export default StaffDashboard;
