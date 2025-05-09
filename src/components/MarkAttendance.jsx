import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import StaffSidebar from './StaffSidebar';
import axios from "axios";
import "./MarkAttendance.css";
import { UserContext } from './UserContext';

function MarkAttendance() {
  const navigate = useNavigate();
  const { staff } = useContext(UserContext);
  const { users } = useContext(UserContext);
  const { setUsers } = useContext(UserContext);
  const staffname = staff.name;
  const subject = staff.course;





  
 

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


  const today = new Date();
  const newDate=`${today.getFullYear()}-0${today.getMonth()+1}-0${today.getDate()}`;
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const todayDate = today.toLocaleDateString('en-US', options);
  const todayday=days[today.getDay()];

  
  
  // State for current displayed date and classes data
  const [currentDate, setCurrentDate] = useState(new Date());
  const [staffClasses, setStaffClasses] = useState([]);
  const [currentDayClasses, setCurrentDayClasses] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [checkDate, setCheckDate] = useState(todayDate);
  


   
  const [greenStates, setGreenStates] = useState(() =>
    users.map(() => true) // default: all green (present)
  );

  const toggleColor = (index) => {
    const newStates = [...greenStates];
    newStates[index] = !newStates[index]; // toggle the specific box
    setGreenStates(newStates);
  };

  //  function to get formatted day name
  const getCurrentDayName = () => days[currentDate.getDay()];


 
 
  
  useEffect(() => {
    // Load staff classes when component mounts
    loadStaffClasses();
    loadStudents();
    sendDate();
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
        console.log("today date: ",todayDate)
        console.log(newDate);
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

  async function loadStudents(){
    try {
      const result = await axios.get("http://localhost:3000/allusers");
      if(result.data.success){
        setUsers(result.data.users);
        console.log("Student list frontend: ", users);
      } else {
        console.log(result.data.message || "Failed to load students");
      }
    } catch (error) {
      console.error("Error loading students: ", error);
    }
  }

  async function sendDate(){
    try{
      const result=await axios.post("http://localhost:3000/setDate",{newDate:newDate});
      if(result.data.success){
        console.log("Date set successfully");
        console.log(result.data);
      } else {
        console.log(result.data.message || "Failed to set date");
      }
    }
    catch (error) {
      console.error("Error setting date: ", error);
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
    const format = `${months[prevDate.getMonth()]} ${prevDate.getDate()}, ${prevDate.getFullYear()}`;
    setCheckDate(format);
    setCurrentDate(prevDate);
    console.log("Prev date: ",checkDate);
   

  };

  // Navigate to next day
  const navigateToNextDay = async() => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    const format = `${months[nextDate.getMonth()]} ${nextDate.getDate()}, ${nextDate.getFullYear()}`;
    setCheckDate(format);
    setCurrentDate(nextDate);
   console.log("next date: ",checkDate);
   

  };

  const handleLogout = () => {
    navigate("/");
  };

  // Function to submit attendance to the backend
  const handleSubmitAttendance = async () => {

    if(todayDate!==checkDate){

      console.log("if: today: ",todayDate);
      console.log("if: check",checkDate);
      alert(`Cannot submit attendance for ${checkDate} !!`);
    }
    else if(todayday==="Saturday" || todayday==="Sunday"){
      console.log(todayday);
      alert(`Cannot submit attendance for: ${todayday} no classes`);
    }
    else if(todayDate===checkDate){
      console.log("else: today: ",todayDate);
      console.log("else: check",checkDate);
    if (!users.length || !staffname || !subject) {
      setSubmitMessage('Missing required data for attendance submission');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('Submitting attendance...');

    try {
      // Create attendance data for each student
      const attendanceData = users.map((student, index) => {
        return {
          date: currentDate,
          studentName: student.name,
          staffName: staffname,
          subject: subject,
          status: greenStates[index] ? 'present' : 'absent'
        };
      });

      // Send attendance data to backend
      const response = await axios.post('http://localhost:3000/submit-attendance', {
        attendanceData: attendanceData
      });

      if (response.data.success) {
        setSubmitMessage('Attendance submitted successfully!');
        setTimeout(() => setSubmitMessage(''), 3000);
      } else {
        setSubmitMessage(`Error: ${response.data.message || 'Failed to submit attendance'}`);
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      setSubmitMessage(`Error: ${error.message || 'Failed to submit attendance'}`);
    } finally {
      setIsSubmitting(false);
    }
  }
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
          <h1>Mark Attendance : 6CSE10</h1>
          <button 
            className="btn" 
            onClick={handleSubmitAttendance} 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          
          {submitMessage && (
            <div className={`submit-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
              {submitMessage}
            </div>
          )}
      
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
                  {users.map((student, index) => {
                    const boxStyle = {
                      backgroundColor: greenStates[index] ? 'green' : 'red',
                    };
              
                    return (
                      <div
                        key={index}
                        className="tt-box3"
                        style={boxStyle}
                        onClick={() => toggleColor(index)}
                      >
                        <h5>{student.name}</h5>
                        <h5>{student.studentId}</h5>
                      </div>
                    );
                  })}
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

export default MarkAttendance;