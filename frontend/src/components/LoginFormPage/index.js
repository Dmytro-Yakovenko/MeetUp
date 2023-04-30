import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/session";
import { useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import "./LoginForm.css";
function LoginFormPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const err = {};
    if (credential.length < 4) {
      err.credential = " should be at least 4 characters in username or email";
    }
    if (password.length < 6) {
      err.password = "should be at least 6 characters in password";
    }
    setErrors(err);
  }, [credential, password]);

  //TO DO handle thunk errors ?????
  // should be page or modal window

  const handleSubmit = (e) => {
    e.preventDefault();
    if (errors.credential || errors.password) {
      return;
    }

    const formData = {
      credential,
      password,
    };

    dispatch(login(formData));
    history.push("/");
    reset();
  };
  const reset = () => {
    setCredential("");
    setPassword("");
  };
  const demoUser = (e) => {
    const user = {
      credential: "Demo-lition",
      password: "password",
    };
    history.push("/");
    return dispatch(sessionActions.login(user));
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Log In</h1>
      <label className="label">
        Username or email
        <input
          className="input"
          type="text"
          value={credential}
          placeholder="Username or Email"
          onChange={(e) => setCredential(e.target.value)}
        />
        {errors.credential && (
          <span className="error">{errors.credential}</span>
        )}
      </label>

      <label className="label">
        Password
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </label>

      <input
        className="btn primaryBtn"
        type="submit"
        value="Log in"
        disabled={!!errors.credential && !!errors.password}
      />

      <button className="demo-btn btn" onClick={demoUser}>
        Log in as demo user
      </button>
    </form>
  );
}

export default LoginFormPage;
