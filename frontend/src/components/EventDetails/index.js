import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { deleteEventById, getEventById } from "../../store/event";
import { getGroupDetails } from "../../store/groups";
import { formatDate } from "../../utils/utils";
import { NavLink } from "react-router-dom";
import { Redirect } from "react-router-dom";
import ModalDelete from "../Modal/modalDelete"; 
 
const deleteConfig={question:"Are you sure you want to remove this event?", btnSubmit:"Yes (Delete Event)", btnCancel: "No (Keep Event)"}

function EventDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const eventDetails = useSelector((state) => state.events.details || {});
  const group = useSelector((state) => state.groups.details || {});

  const user = useSelector((state) => state.session.user);
    const [isModalOpen, setIsModalOpen]= useState(false)
 
  useEffect(() => {
    dispatch(getEventById(+id));
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(getGroupDetails(eventDetails.groupId));
  }, [dispatch, eventDetails]);
  if(!user.id){
    return <Redirect to="/login"/>
  }




  const handleDeleteEvent = (e) => {
    e.preventDefault(id);
    dispatch(deleteEventById(id));
  };
console.log(group)
  const {
    id: eventId,
    EventImages,
    Venue,
    endDate,
    name,
    previewImage,
    startDate,
    type,
    price,
    description,
    capacity,
  } = eventDetails;

  
  const { Organizer, GroupImage, name:groupName, private:privateStatus } = group;

  const startDateContent = formatDate(startDate);
  const endDateContent = formatDate(endDate);


  return (
    <main>
        {
            name && <>
            
            <NavLink to="/events">events</NavLink>
            <h2>{name}</h2>
            {Organizer && (
              <p>
                Hosted by
                <span> {Organizer.firstName}</span>
                <span> {Organizer.lastName}</span>
              </p>
            )}
      
            <img src={EventImages[0].url} alt={name}/>
                {GroupImage && 
                   <div>
                   <img src={GroupImage[0].url}/>
                    {groupName}
                    {privateStatus?<p>private</p>:<p>public</p>}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>
                    <p>START {startDateContent}</p> 
                    <p>END  {endDateContent}</p>

                   <div>
                   <img src="https://res.cloudinary.com/dr1ekjmf4/image/upload/v1683484017/pokerEventImages/icons8-average-price-50_dc1ssp.png" alt="cost"/>
                   {price>0?<p>{price}</p>:<p>FREE</p>}
                   </div>
                  
                    <div>
                        <img src="https://res.cloudinary.com/dr1ekjmf4/image/upload/v1683485223/pokerEventImages/icons8-map-pin-50_rgppcz.png"/>
                       <p>{type}</p>
                    </div>


               </div>
                }
          <button onClick={()=>setIsModalOpen(true)}> Delete </button>


<h3>Details</h3>
<p>
    {description}
</p>
            
            </>  
        }
    


{isModalOpen&& <ModalDelete config={deleteConfig} onSubmit={handleDeleteEvent} onCancel={()=>setIsModalOpen(false)}/>}
    </main>
  );
}

export default EventDetail;
