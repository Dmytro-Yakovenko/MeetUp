import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { deleteGroup, getGroupDetails } from "../../store/groups";
import { NavLink } from "react-router-dom";

function GroupDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    dispatch(getGroupDetails(+id));
  }, [dispatch, id]);
  const groupDetails = useSelector((state) => state.groups.details || {});

  const handleDeleteGroup = (e) => {
    e.preventDefault();
    dispatch(deleteGroup(id));
  };

  const user = useSelector((state) => state.session.user);
  let actionButtons = null;
  if (user.id === groupDetails.organizerId) {
    actionButtons = (
      <div className="button-wrapper">
        <NavLink to={`/groups/${id}/events/new`}>Create event</NavLink>

        <NavLink to={`/groups/${id}/edit`}>Update</NavLink>

        <button onClick={handleDeleteGroup}>Delete</button>
      </div>
    );
  }
  if(user.id!==groupDetails.organizerId){
    actionButtons=(
        <button onClick={() => alert("Feature Coming Soon...")}>
        Join this group
      </button>
    )
  }
  return (

    <main>
      <div className="container">
        <NavLink to="/groups">Groups</NavLink>

        {groupDetails.GroupImage && (
          <img src={groupDetails.GroupImage[0].url} alt={groupDetails.name} />
        )}

        <h2>{groupDetails.name}</h2>

        <p>{groupDetails.location}</p>

        <p>{groupDetails.public}</p>

        {groupDetails.Organizer && (
          <p>
            Organized by {groupDetails.Organizer.firstName}{" "}
            {groupDetails.Organizer.lastName}
          </p>
        )}

 {actionButtons}

        <h2>Organizer</h2>
        {groupDetails.Organizer && (
          <p>
            {groupDetails.Organizer.firstName} {groupDetails.Organizer.lastName}
          </p>
        )}

        <h2>What we're about</h2>
        <p>{groupDetails.about}</p>

        <h2>Upcoming Events (#)</h2>

        {groupDetails.Events}
      </div>
    </main>
  );
}
export default GroupDetails;
