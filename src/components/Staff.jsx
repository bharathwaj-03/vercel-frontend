import React,{useState,useContext} from "react";

import axios from "axios";
import {UserContext} from "./UserContext";

function Staff(props){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

      const [error, setError] = useState('');
      const [loading, setLoading] = useState(false);
 const { staff } = useContext(UserContext);
//  const staffname = staff.name;
       const {setStaffs}=useContext(UserContext);
       
  
       const handleLogin = (e) => {
        e.preventDefault();
      
        setLoading(true);
        setError('');
      
        axios.post("http://localhost:3000/loginstaff", {
          username: username,
          password: password
        })
        .then(async result => {
          if (result.data.success) {
            if (result.data.user.role !== "staff") {
              alert("Enter staff details");
              console.log("Students details not allowed");
              return;
            }
      
            if (props.onLoginSuccess) {
              props.onLoginSuccess(result.data.user);  // this updates context
      
              // Now that staff context is updated, fetch extra staff data
              try {
                const extraStaffs = await axios.post("http://localhost:3000/loadStaffs", {
                  staffname: result.data.user.name
                });
      
                if (extraStaffs.data.success) {
                  console.log("Extra staff data loaded: ", extraStaffs.data.staffs);
                  setStaffs(extraStaffs.data.staffs);
                } else {
                  console.log("Failed to fetch extra staff classes");
                }
              } catch (err) {
                console.error("Frontend extra staff Error:", err);
              }
            }
          } else {
            alert("Invalid username or password");
          }
        })
        .catch(err => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
      };
      
    // async function loadStaffs(){
    //   try{
    //     const result =await axios.post("http://localhost:3000/loadStaffs",{
    //       staffname:staffname
    //     });
    //     if(result.data.success){
    //       console.log("Extra staff data loaded: ",result.data.staffs);
    //       setStaffs(result.data.staffs);
    //     } else{
    //       console.log("Failed to fetch extra staff classes");
    //     }
    //   } catch (err) {
    //     console.error("Frontend extra staff Error:", err);
    //   }
    // }

  


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
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Staff Login</h2>
            {/* {error && <div >{alert("Invalid Username or Password")}</div>}     */}
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
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
    
            <div className="btn-group">
            <button className="orange-btn" type="submit">Login</button>
              
            </div>
            <div className="forgot">
            <p onClick={props.onForgotPassword}>Forgot Password!</p>
          </div>
          </form>
         
        </div>
      </div>
    );
}
export default Staff;

