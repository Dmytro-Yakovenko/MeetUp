import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { NavLink } from "react-router-dom";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleDemoLogin = (e) => {
    e.preventDefault();
    setCredential("Demo-lition");
    setPassword("password");
    dispatch(sessionActions.login("Demo-lition", "password"));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Log In</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className="login-credentials">
          <label className="username-email">
            {/* Username or Email */}
            <input
              className="credentials"
              type="text"
              value={credential}
              placeholder="Username or Email"
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
          <label className="password">
            {/* Password */}
            <input
              className="credentials"
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {/* {errors ? ( */}
          <button className="submit-login" type="submit">
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
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;