import React, { useState, useEffect} from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

import * as sessionActions from "../../store/session";

import "./SignupForm.css";

function SignupFormModal(closeMenu) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [frontErrors, setFrontErrors]=useState({})
  const { closeModal } = useModal();
useEffect(()=>{
const errors = {}
if(email.length<1){
  errors.email="email is empty"
}
if(username.length<4){
  errors.username="Username is less than 4 characters"
}
if(firstName.length<1){
  errors.firstName="First Name is empty"
}
if(lastName.length<1){
  errors.lastName="Last Name is empty"
}
if(password.length<6){
  errors.password="Password is less than 6 characters"
}
if(password!==confirmPassword){
  errors.confirmPassword="Confrm Password does not match Password"
}
setFrontErrors(errors)


},[email,
  username,
  firstName,
  lastName,
  password,
  confirmPassword
  ])
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors([
      "Confirm Password field must be the same as the Password field",
    ]);
  };

  return (
    <>
      <div className="signup-container">
        <h1 className="signup-title">Sign Up</h1>
        <form onSubmit={handleSubmit}>
         
          <div className="signup-info">
            <label className="label">
              {/* Email */}
              <input
                className="signup-input"
                type="text"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {frontErrors && <span className="error">{frontErrors.email}</span>}
            </label>
            <label className="label">
              {/* Username */}
              <input
                className="signup-input"
                type="text"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              {frontErrors && <span className="error">{frontErrors.username}</span>}
            </label>
            <label className="label">
              {/* First Name */}
              <input
                className="signup-input"
                type="text"
                value={firstName}
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              {frontErrors && <span className="error">{frontErrors.firstName}</span>}
            </label>
            <label className="label">
              {/* Last Name */}
              <input
                className="signup-input"
                type="text"
                value={lastName}
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              {frontErrors && <span className="error">{frontErrors.lastName}</span>}
            </label>
            <label className="label">
              {/* Password */}
              <input
                className="signup-input"
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {frontErrors && <span className="error">{frontErrors.password}</span>}
            </label>
            <label className="label">
              {/* Confirm Password */}
              <input
                className="signup-input"
                type="password"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {frontErrors && <span className="error">{frontErrors.confirmPassword}</span>}
            </label>

            <button
            disabled={!!frontErrors.email || !!frontErrors.password || !!frontErrors.confirmPassword|| !!frontErrors.firstName|| !!frontErrors.lastName || frontErrors.username }
              className="signup-button"
              type="submit"
              onClick={handleSubmit}
            >
              Sign Up
            </button>
            <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignupFormModal;