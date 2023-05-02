import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    // <div className="navbar">
    <ul className="navbar">
      <li style={{ listStyleType: "none" }}>
        <NavLink exact to="/">
          {/* Home */}
          <img
            style={{ width: "150px" }}
            src="https://res.cloudinary.com/dwphwqyrn/image/upload/v1678335680/Screen_Shot_2023-03-08_at_8.20.56_PM_zyozdp.png"
          />
        </NavLink>
      </li>
      <div className="rightNav">
        {/* {sessionUser && (
          <li style={{ listStyleType: "none" }}>
            <NavLink exact to="/api/groups/new" className="start-new-group-nav">
              Start a new group
            </NavLink>
          </li>
        )} */}
        {isLoaded && (
          <li style={{ listStyleType: "none" }}>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </div>
    </ul>
    // </div>
  );
}

export default Navigation;


