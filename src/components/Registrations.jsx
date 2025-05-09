import React from "react";
import {Link} from "react-router-dom";

function Registrations(props){

    return (
        <div className="page-wrapper">
        <div className="left-half"></div>
       
        <div className="right-half">
        <div className="right-header">
                  <img src="./images/logo.png" alt="Princeton Logo" className="logo" />
                  <h1>Princeton University</h1>
                </div>
        <div className="parent">
      
<div className="r1" >
    <Link to={"/staff"} style={{ textDecoration: 'none', color: 'inherit' }}><h1>Staff Login</h1></Link>
</div>

<div className="r1" >
    <Link to={"/student"} style={{ textDecoration: 'none', color: 'inherit' }}><h1>Student Login</h1></Link>
</div>
       </div>
        </div>
        </div>
    )

}
export default Registrations;