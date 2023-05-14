import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateGroupById, getGroupDetails} from "../../store/groups";
import { useHistory, useParams, Redirect } from "react-router-dom";

function UpdateGroup() {
  const user = useSelector((state) => state.session.user);
  const {id}=useParams()
  const dispatch= useDispatch()
  useEffect(()=>{
dispatch(getGroupDetails(id))
  },[dispatch,id])
  const group =useSelector(state=>state.groups.details)
 
 
 const history=useHistory()
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("select one");
  const [privateStatus, setPrivateStatus] = useState("select one");
  const [url, setUrl] = useState("");

  const [error, setError] = useState({});

  useEffect(()=>{
    if(group){
      setAddress(`${group.city}, ${group.state}`) 
      setName(group.name)
      setAbout(group.about)
      setType(group.type)
      setPrivateStatus(group.private)
      setUrl(group.GroupImage[0].url)

    }
   
  },[group])


  useEffect(() => {
    const errors = {};
    if (!/\w+, \w+/g.test(address) || address.length < 1) {
      errors.address = "Location is required";
    }
    if (name.length < 5 ) {
      errors.name = "Name is required";
    }
    if (name.length >60  ) {
        errors.name = "Name must be less than 60 characters";
      }
    if (about.length < 50) {
      errors.about = "Description must be at least 50 characters";
    }

    if (type === "select one") {
      errors.type = "Group Type is required";
    }

    if (privateStatus === "select one") {
      errors.privateStatus = "Visibility Type is required";
    }
    if (url &&!url.match(/(\.jpe?g$)|(\.png$)/g)) {
      errors.url = "Image URL must end in .png, .jpg, or .jpeg";
    }
   setError(errors)
  }, [address, name, about, type, privateStatus, url]);

  if(!user.id){
    return <Redirect to="/login"/>
  }



  const handleSubmit =async (e) => {
    e.preventDefault();

    if(!Object.values(error).length){
      const [city, state] = address.split(", ");
      const formData = {
        name,
        about,
        type,
        private: privateStatus,
        city,
        state,
        id:parseInt(id),
         organizerId:user.id
       
      };

     
     reset()
   
  let group = await dispatch(updateGroupById(id,formData))

      history.push(`/groups/${group.id}`)
    }
   
  };
  const reset=()=>{
    setAddress("")
    setName("")
    setAbout('')
    setType("select one")
    setPrivateStatus("select one")
    setUrl("")
  }


  return (
    <main>
      <div className="container">
        <p>UPDATE YOUR GROUP'S INFORMATION</p>
        <h2>
          We'll walk you through a few steps to build your local community
        </h2>
        <hr />
        <form onSubmit={handleSubmit}>
          <div>
            <h3>First, set your group's location.</h3>
            <p>
              Meetup groups meet locally, in person and online. We'll connect
              you with people in your area, and more can join you online
            </p>
            <label className="label">
              <input
                type="text"
                placeholder="City, STATE"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {error.address && <span className="error">{error.address}</span>}
            </label>
          </div>

          <hr />

          <div>
            <h3> What is the name of your group?</h3>

            <p>
              Choose a name that will give people a clear idea of what the group
              is about. Feel free to get creative! You can edit this later if
              you change your mind.
            </p>
            <label className="label">
              <input
                type="text"
                placeholder="Some Group Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {error.name && <span className="error">{error.name}</span>}
            </label>
          </div>

          <hr />

          <div>
            <h3>Now describe what your group will be about</h3>
            <p>
              People will see this when we promote your group, but you'll be
              able to add to it later, too.
            </p>
            <ol>
              <li>What's the purpose of the group?</li>
              <li>Who should join?</li>
              <li> What will you do at your events?</li>
            </ol>
            <label className="label">
              <textarea
                placeholder="Some description about the group"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
              {error.about && <span className="error">{error.about}</span>}
            </label>
          </div>

          <hr />

          <div>
            <h3>Final steps...</h3>

            <label className="label">
              Is this an in person or online group?
              <select
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="select one" disabled>
                  (select one)
                </option>
                <option value="InPerson">In Person</option>
                <option value="On Line">On Line</option>
              </select>
              {error.type && <span className="error">{error.type}</span>}
            </label>
          </div>

          <div>
            <label className="label">
              Is this group private or public?
              <select
                name="private"
                value={privateStatus}
                onChange={(e) => setPrivateStatus(e.target.value)}
              >
                <option value="select one" disabled>
                  (select one)
                </option>
                <option value={true}>Private</option>
                <option value={false}>Public</option>
              </select>
              {error.privateStatus && (
                <span className="error">{error.privateStatus}</span>
              )}
            </label>
          </div>

          <div>
            <label className="label" name="url">
              <input
                type="text"
                placeholder="Image Url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              {error.url && <span className="error">{error.url}</span>}
            </label>
          </div>
          <hr />
          <input 
          className="create-btn"
          type="submit" 
          value="Update Group" 
          disabled={!!error.about  || !!error.url || !!error.type|| !!error.name|| !!error.privateStatus ||!!error.address}
          
          />
        </form>
      </div>
    </main>
  );
}
export default UpdateGroup;
