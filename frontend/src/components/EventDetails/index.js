import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { deleteEventById, getEventById } from "../../store/event";
import { getGroupDetails } from "../../store/groups";
import { formatDate } from "../../utils/utils";
import { NavLink } from "react-router-dom";
import { Redirect } from "react-router-dom";
import ModalDelete from "../Modal/modalDelete";
import "./EventDetail.css";

const deleteConfig = {
  question: "Are you sure you want to remove this event?",
  btnSubmit: "Yes (Delete Event)",
  btnCancel: "No (Keep Event)",
};

function EventDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history =useHistory()
  const eventDetails = useSelector((state) => state.events.details);
  const group = useSelector((state) => state.groups.details);
  console.log(eventDetails, 11111);
  console.log(group, 222222);

  const user = useSelector((state) => state.session.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getEventById(+id));
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(getGroupDetails(+id));
  }, [dispatch, id]);
  if (!user.id) {
    return <Redirect to="/login" />;
  }

  const handleDeleteEvent = (e) => {
    e.preventDefault();
    dispatch(deleteEventById(id));
    history.push(`/groups/${id}`)
  };

  // const {
  //   id: eventId,
  //   EventImages,
  //   Venue,
  //   endDate,
  //   name,
  //   previewImage,
  //   startDate,
  //   type,
  //   price,
  //   description,
  //   capacity,
  // } = eventDetails;

  // const {
  //   Organizer,
  //   GroupImage,
  //   name: groupName,
  //   private: privateStatus,
  // } = group;
  let startDateContent = null;
  if (eventDetails) {
    startDateContent = formatDate(eventDetails.startDate);
  }

  let endDateContent = null;
  if (eventDetails) {
    endDateContent = formatDate(eventDetails.endDate);
  }

  return (
    <main>
      <div className="container">
        {eventDetails && (
          <>
            <NavLink className="breadcrumbs" to="/events">
              events
            </NavLink>
            <h2>{eventDetails.name}</h2>
            {group && (
              <p>
                Hosted by
                <span> {group.Organizer.firstName}</span>
                <span> {group.Organizer.lastName}</span>
              </p>
            )}
            <div className="event-details-wrapper">
              {!!eventDetails.EventImages.length && (
                <img
                  src={eventDetails.EventImages[0].url}
                  alt={eventDetails.name}
                />
              )}
              <div className="event-wrap">
                {group && (
                  <div className="event-group-detail">
                    <img
                      className="group-details-img"
                      src={group.GroupImage[0].url}
                    />

                    <div>
                      {group.name}
                      {group.privateStatus ? <p>private</p> : <p>public</p>}
                    </div>
                  </div>
                )}
                <svg className="icon"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 522 522">
                  <path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
                </svg>
                <p >START {startDateContent}</p>
                <p >END {endDateContent}</p>

                <div>
                  <img
                  className="icon" 
                    src="https://res.cloudinary.com/dr1ekjmf4/image/upload/v1683484017/pokerEventImages/icons8-average-price-50_dc1ssp.png"
                    alt="cost"
                  />
                  {eventDetails.price > 0 ? (
                    <p className="event-text">{eventDetails.price}</p>
                  ) : (
                    <p className="event-text">FREE</p>
                  )}
                </div>

                <div>
                  <img className="icon" src="https://res.cloudinary.com/dr1ekjmf4/image/upload/v1683485223/pokerEventImages/icons8-map-pin-50_rgppcz.png" />
                  <p className="event-text">{eventDetails.type}</p>
                </div>

                <button className="event-btn" onClick={() => alert("This feature coming soon ...")}>
                  Update
                </button>
                <button className="event-btn" onClick={() => setIsModalOpen(true)}> Delete </button>
              </div>
            </div>

            <h3>Details</h3>
            <p className="event-description">{eventDetails.description}</p>
          </>
        )}

        {isModalOpen && (
          <ModalDelete
            config={deleteConfig}
            onSubmit={handleDeleteEvent}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </main>
  );
}

export default EventDetail;
