import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import axios from "axios";
import "./AttendanceRep.css";
import { UserContext } from './UserContext';

function AttendanceRep() {
  const navigate = useNavigate();
  const { staffs } = useContext(UserContext);
  const { user } = useContext(UserContext);
  const [staffNames, setStaffNames] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const studentName = user?.name;

  useEffect(() => {
    if (staffs && staffs.length > 0) {
      fillStaffs(staffs);
    } else {
      console.log("Att Rep: staff is empty");
      fetchStaffs();
    }
  }, [staffs]);

  useEffect(() => {
    if (studentName) {
      loadAttendance(studentName);
    }
  }, [studentName]);

  function fillStaffs(staffs) {
    if (!staffs) return;
    const names = staffs.map((staff) => staff.name);
    setStaffNames(names);
    console.log("Staff names:", names);
  }

  async function fetchStaffs() {
    try {
      const result = await axios.get("http://localhost:3000/getstaff");
      if (result.data.success) {
        console.log("Directly fetched staffs:", result.data.staffs);
        fillStaffs(result.data.staffs);
      } else {
        console.log(result.data.message || "Failed to load staff data");
        setError("Failed to load staff data");
      }
    } catch (error) {
      console.error("Error directly loading staffs:", error);
      setError("Error loading staff data: " + error.message);
    }
  }

  async function loadAttendance(studentName) {
    if (!studentName) {
      setError("Student name is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:3000/getAttendanceReport", {
        params: { studentName }
      });

      if (response.data.success) {
        const staffStatsObj = response.data.staffStats;
        
        // Convert the object to an array for easier rendering
        const staffStatsArray = Object.keys(staffStatsObj).map(staffName => ({
          staffName,
          subject: staffStatsObj[staffName].subject,
          totalHours: staffStatsObj[staffName].totalHours,
          attendedHours: staffStatsObj[staffName].attendedHours,
          percentage: staffStatsObj[staffName].percentage
        }));

        setAttendanceData(staffStatsArray);
        console.log("Attendance data loaded:", staffStatsArray);
      } else {
        setError(response.data.message || "Failed to load attendance data");
      }
    } catch (error) {
      console.error("Error loading attendance:", error);
      setError("Error loading attendance data: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    navigate("/");
  }

  function getAttendanceStatusClass(percentage) {
    if (percentage >= 75) return "status-good";
    if (percentage >= 60) return "status-warning";
    return "status-danger";
  }

  return (
    <div className='attendance-container'>
      <div className="dash-cont">
        <Sidebar onLogout={handleLogout} />
      </div>
      <div className="main-content4">
        <div className='header'>
          <h1>Course Wise Attendance Report</h1>
          <h3 className="student-name">Student: {studentName || "Loading..."}</h3>
        </div>

        {loading ? (
          <div className="loading">Loading attendance data...</div>
        ) : error ? (
          <div className="error">
            <p>{error}</p>
            <button onClick={() => loadAttendance(studentName)} className="retry-btn">
              Retry
            </button>
          </div>
        ) : attendanceData.length === 0 ? (
          <div className="no-data">
            <p>No attendance records found for this student.</p>
          </div>
        ) : (
          <div className="reports-container">
            {attendanceData.map((staff, index) => (
              <div key={index} className="report">
                <div className='report-content'>
                  <div className='report-row'>
                    <div className="label">Course:</div>
                    <div className="value">{staff.subject}</div>
                  </div>
                  <div className='report-row'>
                    <div className="label">Faculty:</div>
                    <div className="value">{staff.staffName}</div>
                  </div>
                  <div className='report-row'>
                    <div className="label">Total Hours:</div>
                    <div className="value">{staff.totalHours}</div>
                  </div>
                  <div className='report-row'>
                    <div className="label">Attended Hours:</div>
                    <div className="value">{staff.attendedHours}</div>
                  </div>
                  <div className='report-row'>
                    <div className="label">Attendance:</div>
                    <div className={`value percentage ${getAttendanceStatusClass(staff.percentage)}`}>
                      {staff.percentage}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceRep;