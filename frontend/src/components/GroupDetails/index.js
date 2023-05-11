import { useSelector, useDispatch } from "react-redux";
import { useParams, Redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteGroup, getGroupDetails } from "../../store/groups";
import { NavLink } from "react-router-dom";
import ModalDelete from "../Modal/modalDelete";
import { getEventsForGroup } from "../../store/event";
import Events from "../Events";

import "./GroupDetails.css";

const deleteConfig = {
  question: "Are you sure you want to remove this group?",
  btnSubmit: "Yes (Delete Group)",
  btnCancel: "No (Keep Group)",
};

function GroupDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    dispatch(getGroupDetails(+id));
  }, [dispatch, id]);
  const groupDetails = useSelector((state) => state.groups.details || {});

  const events = useSelector((state) => Object.values(state.events));
  useEffect(() => {
    dispatch(getEventsForGroup(id));
  }, [dispatch]);

  let content = groupDetails.status ? "public" : "private";
  console.log(groupDetails);
  const upcomingEvents = events.filter((item) => {
    const startDate = new Date(item.startDate);
    const today = new Date();
    if (startDate > today) {
      return item;
    }
  });

  const pastEvents = events.filter((item) => {
    const startDate = new Date(item.startDate);
    const today = new Date();
    if (startDate < today) {
      return item;
    }
  });

  const handleDeleteGroup = (e) => {
    e.preventDefault();
    dispatch(deleteGroup(id));
  };

  const user = useSelector((state) => state.session.user);

  const [isModalOpen, setIsModalOpen] = useState(false);

  //   if(!user){
  //     return Redirect("/login");
  //   }
  let actionButtons = null;
  if (user) {
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
  return (
    <main>
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
            {groupDetails.Organizer.firstName} {groupDetails.Organizer.lastName}
          </p>
        )}

        <h2>What we're about</h2>
        <p>{groupDetails.about}</p>
        {!!upcomingEvents.length && (
          <>
            <h2>Upcoming Events (#)</h2>

            <ul>
              {upcomingEvents.map((item) => (
                <li key={item.id}>
                  <NavLink to={`/groups/${groupDetails.id}/events/${item.id}`}>
                    <div>
                      <img src={item.previewImage} alt={item.name} />
                    </div>
                    <div>


                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        )}

{!!pastEvents.length && (
          <>
            <h2>Past Events (#)</h2>

            <ul>
              {pastEvents.map((item) => (
                <li key={item.id}>
                  <NavLink to={`/groups/${groupDetails.id}/events/${item.id}`}>
                    <div className="group-details-wrapper">
                      <img className="group-details-image" src={item.previewImage} alt={item.name} />
                    
                    <div>
                <p>{item.name}</p>
                    </div>
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        )}


      </div>

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
