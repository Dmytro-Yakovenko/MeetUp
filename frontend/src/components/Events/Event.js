import "./Events.css";
import { NavLink } from "react-router-dom";
import {formatDate} from "../../utils/utils"
function Event({ event }) {
  
  const { id, Venue, endDate, name, previewImage, startDate, type,price, description, capacity } = event;
  const contentData=formatDate(startDate)
  let content = null;
  if (Venue) {
    content = (
      <>
        <p>{Venue.city}</p>
        <p>{Venue.state}</p>
      </>
    );
  }
  if (!Venue) {
    content = <p>Location will be later</p>;
  }
  return (
    <>
       <NavLink to={`/events/${id}`}>
      <li className="event-item">
        <img  src={previewImage} alt={name} className="event-image" />
    <div className="event-wraper">
    {contentData}
    <h3> {name}</h3>

        <div>{content}</div>
        <p>{description}</p>

    </div>
    
        

      </li>
    </NavLink>
    <hr/>
    </>
 
  );
}

export default Event;
