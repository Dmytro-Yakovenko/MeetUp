import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllEvents } from "../../store/event";
import { NavLink } from "react-router-dom";
import Event from "./Event";

function Events() {
  const events = useSelector((state) => Object.values(state.events) || []);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  return (
    <main>
      <div className="container">
      <NavLink
          style={{
            marginRight: "20px",
            textDecoration: "none",
            color: "#666666",
          }}
          onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          to="/groups"
        >
          groups
        </NavLink>
        <NavLink style={{ color: "teal", textDecoration: "underline", cursor:"none" }} to="/events">events</NavLink>
     

        <p>Events in Meetup</p>

        <ul>
          {events.map((item) => {
            return <Event key={item.id} event={item} />;
          })}
        </ul>
      </div>
    </main>
  );
}
export default Events;
