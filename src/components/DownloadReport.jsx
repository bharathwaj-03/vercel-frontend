import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import axios from "axios";
import "./DownloadReport.css";
import { UserContext } from './UserContext';

function DownloadReport() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const studentName = user?.name;

  function handleLogout() {
    navigate("/");
  }

  async function downloadAttendanceReport() {
    if (!studentName) {
      setError("You must be logged in to download a report");
      return;
    }

    setLoading(true);
    setError(null);
    setDownloadStarted(false);

    try {
      // Using axios to make a GET request and handle the response as a blob
      const response = await axios({
        url: `http://localhost:3000/downloadAttendanceReport`,
        method: 'GET',
        responseType: 'blob', // Important for handling PDF file
        params: { studentName }
      });

      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_report_${studentName.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setDownloadStarted(true);
    } catch (error) {
      console.error("Error downloading report:", error);
      setError("Failed to download report. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='download-container'>
      <div className="dash-cont">
        <Sidebar onLogout={handleLogout} />
      </div>
      <div className="main-content">
        <div className='header'>
          <h1>Download Attendance Report</h1>
        </div>
        
        <div className="download-card">
          <div className="card-content">
            <div className="card-icon">
              <i className='bx bxs-file-pdf'></i>
            </div>
            <h2>Attendance Report</h2>
            <p>Download your complete attendance report for all courses</p>
            <p className="student-info">Student: {studentName || "Not logged in"}</p>
            
            {error && <div className="error-message">{error}</div>}
            {downloadStarted && <div className="success-message">Your download has started!</div>}
            
            <button 
              className="download-btn" 
              onClick={downloadAttendanceReport}
              disabled={loading || !studentName}
            >
              {loading ? (
                <span>
                  <i className='bx bx-loader-alt bx-spin'></i> Generating PDF...
                </span>
              ) : (
                <span>
                  <i className='bx bx-download'></i> Download PDF Report
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DownloadReport;