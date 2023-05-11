import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllGroups } from "../../store/groups";
import Group from "./Group";
import { NavLink } from "react-router-dom";
import GroupEvent from "../GroupEvent";
function Groups() {
  const dispatch = useDispatch();
  const groups = useSelector((state) => {
    return Object.values(state.groups) || [];
  });

  useEffect(() => {
    dispatch(getAllGroups());
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
          to="/events"
        >
          events
        </NavLink>
        <NavLink style={{ color: "teal", textDecoration: "underline",cursor:"none" }} to="/groups">groups</NavLink>

        <p className="section-title">Groups in Meetup</p>
        <ul>
          {groups.map((item) => {
            return <Group key={item.id} group={item} />;
          })}
        </ul>
      </div>
    </main>
  );
}
export default Groups;
