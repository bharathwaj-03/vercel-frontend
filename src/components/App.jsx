import React from 'react'; 
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Registrations from './Registrations'; 
import Student from './Student'; 
import Staff from "./Staff"; 
import ForgotPass from './ForgotPass'; 
import Dashboard from './Dashboard';
import TimeTable from './TimeTable';
import AcademicCalendar from './AcademicCalendar';
import AcademicCalendar2 from "./AcademicCalendar2";
import StaffDashboard from './StaffDashboard';
import StaffClasses from "./StaffClasses";
import { useContext } from 'react';
import { UserProvider } from './UserContext';
import { UserContext } from './UserContext';
import MarkAttendance from './MarkAttendance';
import AttendanceRep from './AttendanceRep';
import DownloadReport from "./DownloadReport";
import Meetings from "./Meetings";



function AcademicCalendarWrapper() {
  
  return <AcademicCalendar />;
}

function StudentWrapper() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };
  
  const handleLoginSuccess = (user) => {
    setUser(user);
    navigate('/dashboard'); 
  };
  
  return (
    <Student 
      onBack={handleBack}
      onForgotPassword={handleForgotPassword}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

function StaffWrapper() {
  const navigate = useNavigate();
  const { setStaff } = useContext(UserContext);
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };
  
  const handleLoginSuccess = (user) => {
    setStaff(user);
    navigate('/staffdashboard'); 
  };
  
  return (
    <Staff 
      onBack={handleBack}
      onForgotPassword={handleForgotPassword}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

function ForgotPasswordWrapper() {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/');
  };
  
  return <ForgotPass onBack={handleBack} />;
}

function DashboardWrapper() {

  const navigate = useNavigate();
  
  const handleLogout = () => {
    navigate('/');
  };
  
  return <Dashboard onLogout={handleLogout} />;
}
function StaffDashboardWrapper() {

  const navigate = useNavigate();
  
  const handleLogout = () => {
    navigate('/');
  };
  
  return <StaffDashboard onLogout={handleLogout} />;
}


function App() { 


  return (
    <BrowserRouter>
    <UserProvider>
      <Routes>
        <Route path="/*" element={<Registrations />} />
        <Route path="/student" element={<StudentWrapper />} />
        <Route path="/staff" element={<StaffWrapper />} />
        <Route path="/forgot-password" element={<ForgotPasswordWrapper />} />
        <Route path="/dashboard" element={<DashboardWrapper />} />
        <Route path="/staffdashboard" element={<StaffDashboardWrapper/>} />
        <Route path="/update/:id" element={<StudentWrapper />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/homestaff" element={<StaffDashboard />} />
        <Route path="/timetable"  element={<TimeTable />}  />
        <Route path="/academic-calendar" element={<AcademicCalendarWrapper />} />
        <Route path="/academic-calendar2" element={<AcademicCalendar2 />} />
        <Route path="/classes" element={<StaffClasses />} />
        <Route path="/mark" element={<MarkAttendance />} />
        <Route path="/attendance" element={<AttendanceRep />} />
        <Route path="/download" element={<DownloadReport />} />
        <Route path="/meetings" element={<Meetings />} />
        
      </Routes>
      </UserProvider>
    </BrowserRouter>
  ); 
} 
 
export default App;