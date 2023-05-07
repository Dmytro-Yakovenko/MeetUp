import "./Events.css";
import { NavLink } from "react-router-dom";

function Event({ event }) {
  console.log(event);
  const { id, Venue, endDate, name, previewImage, startDate, type,price, description, capacity } = event;
  const eventDate = new Date(startDate);
  const hours = eventDate.getHours()
  let minutes = eventDate.getMinutes()
  if(minutes<10){
    minutes=`0${minutes}`
  }
  let day =eventDate.getDate()
  let month =eventDate.getMonth()+1
    let year = eventDate.getFullYear()
  const dateOfEvent = `${year}-${month}-${day}`;
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
    <NavLink to={`/events/${id}`}>
      <li className="event-item">
        <img src={previewImage} alt="{name" className="event-image" />
        <p>
          {dateOfEvent}
          <span> {hours}:{minutes}</span>
        </p>
    <h3> {name}</h3>

        <div>{content}</div>
        <p>{description}</p>

      </li>
    </NavLink>
  );
}

export default Event;
