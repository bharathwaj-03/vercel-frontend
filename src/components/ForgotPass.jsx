import React,{useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
 function ForgotPass(props){
const navigate=useNavigate();
          const [username, setUsername] = useState('');
            const [password, setPassword] = useState('');
            const[newPassword,setnewPassword]=useState('');
          
         
       async     function handleChange(e) {
              e.preventDefault();
              if (password !== newPassword) {
                alert("New password and confirmation do not match.");
                return;
              }
            
         await    axios.post("http://localhost:3000/changePassword", {
                username: username,
                password: password,
                newPassword: newPassword
              })
              .then(result => {
                if (result.data.success) {
                  alert("Password changed successfully");
                  console.log("Success", result);
                  navigate("/");
                } else {
                  alert(result.data.message || "Try Again");
                }
              })
              .catch(err => {
                console.error("Error changing password:", err);
                alert("An error occurred while changing the password. Please try again.");
              });
            }
            return(
                <div className="page-wrapper">
                <div className="left-half">
                <div className="back-btn">
                        <button onClick={props.onBack} id="back">
                        <i className='bx bx-arrow-back'></i>
                        </button>
                    </div>
                </div>
            
                <div className="right-half">
                <div className="right-header">
                  <img src="./images/logo.png" alt="Princeton Logo" className="logo" />
                  <h1>Princeton University</h1>
                </div>
               
                  <form className="login-form" onSubmit={handleChange}>
                    <h2>Password Reset</h2>
            
                    <div className="input-box">
                      <i className='bx bx-user'></i>
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
            
                    <div className="input-box">
                      <i className='bx bx-lock-alt'></i>
                      <input
                        type="password"
                        placeholder="Enter New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div className="input-box">
                      <i className='bx bx-lock-alt'></i>
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={newPassword}
                        onChange={(e) => setnewPassword(e.target.value)}
                      />
                    </div>
            
                    <div className="btn-group">
                    <button className="orange-btn" >Change Password</button>
                      
                    </div>
                  </form>
                 
                 
                </div>
              </div>
            ); 
    
 }
 export default ForgotPass;