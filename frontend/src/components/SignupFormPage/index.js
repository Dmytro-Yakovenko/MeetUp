// frontend/src/components/SignupFormPage/index.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";

import "./SignupForm.css";


  //TO DO handle thunk errors ?????
    // should be page or modal window


function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  // if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      ).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
    
      <form className="form" onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
        <label className="label">
          Email
          <input
            className="input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
            {errors.email && <span className="error">{errors.email}</span>}
        </label>
       
        <label className="label">
          Username
          <input
          className="input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
           {errors.username && <span className="error">{errors.username}</span>}
        </label>
       
        <label className="label">
          First Name
          <input
           className="input"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
              {errors.firstName && <span className="error"> {errors.firstName}</span>}
        </label>
    
        <label className="label">
          Last Name
          <input
           className="input"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
                 {errors.lastName && <span className="error"> {errors.lastName}</span>}
        </label>
 
        <label className="label">
          Password
          <input
           className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
           {errors.password && <span className="error">{errors.password}</span>}
        </label>
       
        <label className="label">
          Confirm Password
          <input
           className="input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
{errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </label>
      
        <button  className="btn primaryBtn" type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormPage;