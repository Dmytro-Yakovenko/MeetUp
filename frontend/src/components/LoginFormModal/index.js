import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { NavLink } from "react-router-dom";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
const [frontErrors, setFrontErrors]=useState({})
  const handleDemoLogin = (e) => {
    e.preventDefault();
    setCredential("yakovenko@gmail.com");
    setPassword("password");
    dispatch(sessionActions.login("yakovenko@gmail.com", "password"));
   
   
  };
useEffect(()=>{
const errors ={}
if(credential.length<4){
  errors.credential='4 characters in username'
}
if(password.length<6){
  errors.password='6 characters in username'
}
setFrontErrors(errors)
},[credential, password])

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
       
        if (data ) setErrors(data);
      });
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Log In</h1>
      <form onSubmit={handleSubmit}>
      
        <div className="login-credentials">
          <label className="username-email label">
            {/* Username or Email */}
            <input
              className="credentials"
              type="text"
              value={credential}
              placeholder="Username or Email"
              onChange={(e) => setCredential(e.target.value)}
              required
            />
            {frontErrors.credential && <span className="error">{frontErrors.credential}</span>}
          </label>
          <label className="password label">
            {/* Password */}
            <input
              className="credentials"
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
             {frontErrors.password && <span className="error">{frontErrors.password}</span>}
          </label>
          {/* {errors ? ( */}
          <button 
          className="submit-login"
           type="submit"
           disabled={!!frontErrors.credential || !!frontErrors.password}
           >
            Log In
          </button>
         
          {/* // ) : (
          //   <button className="submit-login-success" type="submit">
          //     Log In
          //   </button>
          // )} */}

          <a className="demo" href="#" onClick={handleDemoLogin}>
            Demo User
          </a>
          <ul>
          {errors &&
            <li>{errors.message}</li>
        }
        </ul>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;