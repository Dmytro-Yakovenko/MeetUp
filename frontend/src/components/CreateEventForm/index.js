import { useDispatch, useSelector } from "react-redux";
import { Redirect, useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { createEventByGroupId } from "../../store/event";
import "./CreateEventForm.css"
import { getGroupDetails } from "../../store/groups";

function CreateEventForm() {
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
const {id}=useParams()
const history= useHistory()
  const group = useSelector((state) => state.groups.details || {});

 
  //states
  const [name, setName] = useState("");
  const [type, setType] = useState("select one");
  const [privateStatus, setPrivateStatus] = useState("select one");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [url, setUrl] = useState("");
  const [price, setPrice]=useState(0)
  const [description, setDescription] = useState("");

  const [error, setError] = useState({});
useEffect(()=>{
  dispatch(getGroupDetails(+id))
},[dispatch, id])

  useEffect(()=>{
    const errors={}
    if (name.length < 5) {
        errors.name = "Name is required";
      }
      if (description.length < 30) {
        errors.description = "Description must be at least 30 characters";
      }
  
      if (type === "select one") {
        errors.type = "Group Type is required";
      }
  
      if (privateStatus === "select one") {
        errors.privateStatus = "Visibility Type is required";
      }
      if (!url.match(/(\.jpe?g$)|(\.png$)/g)) {
        errors.url = "Image URL must end in .png, .jpg, or .jpeg";
      }
      if(!startDate){
        errors.startDate="Event start is required"
      }
      if(!startDate){
        errors.endDate="Event end is required"
      }
      if(!price){
        errors.price="Price is required"
      }
     setError(errors)
  },[ name, description, type, privateStatus, url, startDate, endDate, price])



  const handleSubmit =async (e) => {
    e.preventDefault();
  
    if(!Object.values(error).length){
        
        const formData = {
          name,
         description,
          type,
          private: privateStatus,
        groupId:+group.id,
          preview: url,
            capacity:10, 
            venueId:1,
            endDate, 
            startDate,
            price:parseInt(price),
            
        };
       reset()
       console.log(formData, group.id)
        let event = await   dispatch(createEventByGroupId(group.id,formData))
        console.log(event)
        history.push(`/events/${event.id}`)
  }
}
  const reset=()=>{
    setName("")
    setDescription('')
    setType("select one")
    setPrivateStatus("select one")
    setUrl("")
    setPrice(0)
    setEndDate("")
    setStartDate("")
  }


  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <main>
        <div className="container create-event">
     

      <form onSubmit={handleSubmit}>
      {group.name && <h3> Create an event for {group.name}</h3>} 
        <div>
          <label className="label">
            What is the name of your event?
            <input
             type="text" 
             placeholder="Event Name" 
             value={name} 
             onChange={(e)=>setName(e.target.value)}
             />
             {error.name && <span className="error">{error.name}</span>}
          </label>
        </div>

        <hr />

        <div>
          <label className="label">
            Is this an in person or online event?
            <div>
            <select
            
            name="type"
            value={type}
            onChange={(e)=>setType(e.target.value)}
            
            >
              <option value="select one" disabled>
                (select one)
              </option>
              <option value="inPerson">inPerson</option>
              <option value="onLine">onLine</option>
            </select>


            </div>
           
            {error.type && <span className="error">{error.type}</span>}
          </label>
        </div>

        <div>
          <label className="label">
            Is this event private or public?


            <div>

            <select
            name="private"
            value={privateStatus}
            onChange={(e)=>setPrivateStatus(e.target.value)}
            >
              <option value="select one" disabled>
                (select one)
              </option>
              <option value={true}>Private</option>
              <option value={false}>Public</option>
            </select>

            </div>
           
            <span className="error">{error.privateStatus}</span>
          </label>
        </div>
        <div>
          <label className="label position">
            What is the price for your event?
            <input 
           
            type="number" 
            placeholder="0"
            name="price"
            value={price}
            onChange={(e)=>setPrice(e.target.value)}

            />
            <img
                className="item"
              src="https://res.cloudinary.com/dr1ekjmf4/image/upload/v1683484017/pokerEventImages/icons8-average-price-50_dc1ssp.png"
              alt="$"
            />
            <span className="error">{error.price}</span>
          </label>
        </div>
        <hr />
        <div>
          <label className="label position">
            When does your event start?
            <input
           
             type="date" 
             placeholder="MM/DD/YYYY HH:mm AM" 
             name="startDate"
             value={startDate}
             onChange={(e)=>setStartDate(e.target.value)}
             />
            <img
            className="item"
              src="https://res.cloudinary.com/dr1ekjmf4/image/upload/v1683519133/pokerEventImages/icons8-calendar-50_ezmcsi.png"
              alt="calendar"
            />
            <span className="error">{error.startDate}</span>
          </label>
        </div>

        <div>
          <label className="label position">
            When does your event end?
            <input 
            
            type="date"
             placeholder="MM/DD/YYYY HH:mm AM" 
             name="endDate"
             value={endDate}
             onChange={(e)=>setEndDate(e.target.value)}
             />
            <img
                className="item"
              src="https://res.cloudinary.com/dr1ekjmf4/image/upload/v1683519133/pokerEventImages/icons8-calendar-50_ezmcsi.png"
              alt="calendar"
            />
            <span className="error">{error.endDate}</span>
          </label>
        </div>
        <hr />

        <div>
          <label className="label">
            Please add in image url for your event below:
            <input
             type="text"
              placeholder="Image URL" 
              name="url"
              value={url}
              onChange={(e)=>setUrl(e.target.value)}
              />
              {error.url && <span className="error">{error.url}</span>}
          </label>
        </div>
        <hr />
        <div>
          <label className="label">
            Please describe your event:
            <textarea 
            placeholder="Please include at least 30 characters"
            name="description"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            />
             {error.description && <span className="error">{error.description}</span>}
          </label>
        </div>

        <input 
        className="create-btn"
        type="submit" 
        value="Create Event"
        disabled={!!error.description  || !!error.url || !!error.startDate|| !!error.endDate|| !!error.type|| !!error.name|| !!error.privateStatus|| !!error.price}
        />
      </form>
      </div>
    </main>
  );
}
export default CreateEventForm
