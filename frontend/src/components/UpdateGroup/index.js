import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateGroup} from "../../store/groups";
import { useHistory, useParams, Redirect } from "react-router-dom";
function UpdateGroup() {
  const user = useSelector((state) => state.session.user);
  const {id}=useParams()
  const group =useSelector(state=>state.groups[id])
 const dispatch= useDispatch()
 const history=useHistory()
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("select one");
  const [privateStatus, setPrivateStatus] = useState("select one");
  const [url, setUrl] = useState("");

  const [error, setError] = useState({});

  useEffect(() => {
    const errors = {};
    if (!/\w+, \w+/g.test(address) || address.length < 1) {
      errors.address = "Location is required";
    }
    if (name.length < 1) {
      errors.name = "Name is required";
    }
    if (about.length < 30) {
      errors.about = "Description must be at least 30 characters";
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
   setError(errors)
  }, [address, name, about, type, privateStatus, url]);

  if(!user.id){
    return <Redirect to="/login"/>
  }


// Question is button create group should be disabled?
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
        organaizerId: user.id,
        preview: url,
      };
     reset()
      // dispatch(createNewGroup(formData))
      //redirect card group inform
  let group = await dispatch(updateGroup(formData))
  console.log(group)
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
        <p>BECOME AN ORGANIZER</p>
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
            <h3> What will your group's name be?</h3>

            <p>
              Choose a name that will give people a clear idea of what the group
              is about. Feel free to get creative! You can edit this later if
              you change your mind.
            </p>
            <label className="label">
              <input
                type="text"
                placeholder="What is your group name?"
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
                placeholder="Please write at least 30 characters"
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
