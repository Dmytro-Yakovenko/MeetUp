import "./Groups.css";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEventsForGroup } from "../../store/event";
function Group({ group }) {
  const dispatch = useDispatch();
  const {
    name,
    about,
    previewImage,
    city,
    private: status,
    type,
    state,
    id,
  } = group;
  const events = useSelector((state) => Object.values(state.events));
  console.log(events)
  useEffect(() => {
    dispatch(getEventsForGroup(id));
  }, [dispatch]);
 const eventsLength=events.filter(item=>item.id===id).length
  let content=(status)?'public':"private"
 
  return (

<>
<NavLink className="group-link" to={`/groups/${id}`}>
      <li className="group-item">
        <img src={previewImage} alt={name} className="image" />
        <div className="group-wrapper">
          <h2>{name}</h2>
          <p>{about}</p>
          <p>  {eventsLength} events	&middot; {content}  </p>
          <p>
            Location: {state}, {city}
          </p>

          <p>{type}</p>
        </div>
      </li>
    </NavLink>
    <hr/>
</>

   
  );
}
export default Group;
