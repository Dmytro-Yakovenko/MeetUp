import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { NavLink } from "react-router-dom";
import "./Navigation.css";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <div className="profile-button">
        <i className="fas fa-user-circle" onClick={openMenu} />
      </div>
      {/* <button className="profile-button" onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button> */}
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <div className="logout-drop-down">
              <li style={{ listStyleType: "none" }}>{user.username}</li>
              <li style={{ listStyleType: "none" }}>
                {user.firstName} {user.lastName}
              </li>
              <li style={{ listStyleType: "none" }}>{user.email}</li>
              <li style={{ listStyleType: "none" }}>
                <button className="logout-button" onClick={logout}>
                  Log Out
                </button>
              </li>
            </div>
          </>
        ) : (
          <>
            <div className="drop-down-container">
              <li style={{ listStyleType: "none" }}>
                <div className="login-button-dropdown">
                  <OpenModalButton
                    buttonText="Log In"
                    onButtonClick={closeMenu}
                    styleBtn='login-button-dropdown'
                    modalComponent={<LoginFormModal />}
                  />
                </div>
              </li>
              <li style={{ listStyleType: "none" }}>
                <OpenModalButton
                  buttonText="Sign Up"
                  onButtonClick={closeMenu}
                  styleBtn='login-button-dropdown'
                  modalComponent={<SignupFormModal />}
                />
              </li>
              <li style={{ listStyleType: "none" }}>
                <NavLink className="navlink-drop-down" to="/api/groups">
                  View groups
                </NavLink>
              </li>
              <li style={{ listStyleType: "none" }}>
                <NavLink className="navlink-drop-down" to="/api/events">
                  View events
                </NavLink>
              </li>
            </div>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;