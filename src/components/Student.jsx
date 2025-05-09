import React, { useState } from "react";
import {  useNavigate } from "react-router-dom";
import axios from "axios";

function Student(props) {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);



  function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
   

    
  
    axios.post("http://localhost:3000/login", {
      username: username,
      password: password
    })
    .then(result => {
      if (result.data.success) {
        // Check the user's role
        if (result.data.user.role !== "student") {
          alert("Enter student details");
          console.log("Staff details not allowed");
          return; 
        }
  
        // Pass user data to parent component
        if (props.onLoginSuccess) {
          props.onLoginSuccess(result.data.user); // Pass user data directly
        } else {
          // navigate('/dashboard');
        }
      } else {
       
        alert("Invalid username or password")
      }
    })
    .catch(err => {
      setError(err);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  const handleBackClick = () => {
    if (props.onBack) {
      props.onBack();
    } else {
      navigate('/');
    }
  };

  const handleForgotPasswordClick = () => {
    if (props.onForgotPassword) {
      props.onForgotPassword();
    } else {
      navigate('/forgot-password');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="left-half">
        <div className="back-btn">
          <button onClick={handleBackClick} id="back">
            <i className='bx bx-arrow-back'></i>
          </button>
        </div>
      </div>

      <div className="right-half">
        <div className="right-header">
          <img src="./images/logo.png" alt="Princeton Logo" className="logo" />
          <h1>Princeton University</h1>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Student Login</h2>
          
          {/* {error && <div >{alert("Invalid Username or Password")}</div>} */}

          <div className="input-box">
            <i className='bx bx-user'></i>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <i className='bx bx-lock-alt'></i>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="btn-group">
            <button 
              className="orange-btn" 
            
            >
              Login
            </button>
          </div>

          <div className="forgot">
            <p onClick={handleForgotPasswordClick}>Forgot Password!</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Student;