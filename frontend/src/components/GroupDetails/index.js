import { useSelector, useDispatch } from "react-redux";
import { useParams, Redirect, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteGroup, getGroupDetails } from "../../store/groups";
import { NavLink } from "react-router-dom";
import ModalDelete from "../Modal/modalDelete";
import { getEventsForGroup } from "../../store/event";
import { formatDate } from "../../utils/utils";

import "./GroupDetails.css";

const deleteConfig = {
  question: "Are you sure you want to remove this group?",
  btnSubmit: "Yes (Delete Group)",
  btnCancel: "No (Keep Group)",
};

function GroupDetails() {
  const history=useHistory()
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    dispatch(getGroupDetails(+id));
  }, [dispatch, id]);
  const groupDetails = useSelector((state) => state.groups.details);
  useEffect(() => {
    
    dispatch(getEventsForGroup(id));
  }, [dispatch, id]);

  const events = useSelector((state) => Object.values(state.events));
 

 

  let content = null;
  if (groupDetails) {
    content = groupDetails.status ? "public" : "private";
  }
  const upcomingEvents = events.filter((item) => {
    const startDate = new Date(item.startDate);
    const today = new Date();
    if (startDate > today) {
      return item;
    }
  });
  if (upcomingEvents.length) {
    upcomingEvents.sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );
  }

  const pastEvents = events.filter((item) => {
    const startDate = new Date(item.startDate);
    const today = new Date();
    if (startDate < today) {
      return item;
    }
  });

  if (pastEvents.length) {
    pastEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }

  const handleDeleteGroup = (e) => {
    e.preventDefault();
    dispatch(deleteGroup(id));
    history.push("/groups")

  };

  const user = useSelector((state) => state.session.user);

  const [isModalOpen, setIsModalOpen] = useState(false);

  //   if(!user){
  //     return Redirect("/login");
  //   }
  let actionButtons = null;
  if (user && groupDetails) {
    if (user.id === groupDetails.organizerId) {
      actionButtons = (
        <div className="button-wrapper">
          <NavLink className="group-btn" to={`/groups/${id}/events/new`}>
            Create event
          </NavLink>

          <NavLink className="group-btn" to={`/groups/${id}/edit`}>
            Update
          </NavLink>

          <button className="group-btn" onClick={() => setIsModalOpen(true)}>
            Delete
          </button>
        </div>
      );
    }
  }
  if (groupDetails) {
    if (!user || user.id !== groupDetails.organizerId) {
      actionButtons = (
        <button
          className="join-btn"
          onClick={() => alert("Feature Coming Soon...")}
        >
          Join this group
        </button>
      );
    }
  }

  return (
    <main>
      {groupDetails && (
        <div className="container">
          <NavLink className="breadcrumbs" to="/groups">
            Groups
          </NavLink>
          <div className="group-details-wrapper">
            {groupDetails.GroupImage && (
              <img
                className="group-details-image"
                src={groupDetails.GroupImage[0].url}
                alt={groupDetails.name}
              />
            )}
            <div>
              <h2>{groupDetails.name}</h2>

              <p>
                {groupDetails.city}, {groupDetails.state}
              </p>

              <p>
                {" "}
                {events.length} events &middot; {content}{" "}
              </p>

              {groupDetails.Organizer && (
                <p>
                  Organized by {groupDetails.Organizer.firstName}{" "}
                  {groupDetails.Organizer.lastName}
                </p>
              )}

              {actionButtons}
            </div>
          </div>
          <h2>Organized by</h2>
          {groupDetails.Organizer && (
            <p>
              {groupDetails.Organizer.firstName}{" "}
              {groupDetails.Organizer.lastName}
            </p>
          )}

          <h2>What we're about</h2>

          <p>{groupDetails.about}</p>
        
          {!!upcomingEvents.length ? (
            <>
              <h2>Upcoming Events ({upcomingEvents.length})</h2>

              <ul>
                {upcomingEvents.map((item) => (
                  <li className="group-event" key={item.id}>
                    <NavLink
                      to={`/events/${item.id}`}
                    >
                      <div className="group-details-wrapper group-event">
                        <img
                          className="group-details-image"
                          src={item.previewImage}
                          alt={item.name}
                        />

                        <div>
                          {formatDate(item.startDate)}
                          <p>{item.name}</p>
                        {item.Venue && <p>
                            {item.Venue.city}, {item.Venue.state}
                          </p>}
                        </div>
                      </div>
                      <p className="group-event-description">
                        {item.description}
                      </p>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </>
          ):(<h2 className="events-title">No upcoming events</h2>)}

          {!!pastEvents.length ? (
            <>
              <h2>Past Events ({pastEvents.length})</h2>

              <ul>
                {pastEvents.map((item) => (
                  <li className="group-event" key={item.id}>
                    <NavLink
                      to={`/events/${item.id}`}
                    >
                      <div className="group-details-wrapper group-event">
                        <img
                          className="group-details-image"
                          src={item.previewImage}
                          alt={item.name}
                        />

                        <div>
                          {formatDate(item.startDate)}
                          <p>{item.name}</p>
                          {item.Venue && (
                            <p>
                              {item.Venue.city}, {item.Venue.state}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="group-event-description">
                        {item.description}
                      </p>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </>
          ):(<h2 className="events-title">No past events</h2>)}
        </div>
      )}
      {isModalOpen && (
        <ModalDelete
          config={deleteConfig}
          onSubmit={handleDeleteGroup}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
}
export default GroupDetails;
