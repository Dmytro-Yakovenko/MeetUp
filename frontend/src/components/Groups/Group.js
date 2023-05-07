 import "./Groups.css"
import { NavLink } from "react-router-dom"
 function Group({group}){
    const {name, about, previewImage, city, private:status, type, state,id }=group
    
    return(
        <NavLink to ={`/groups/${id}`}>
 <li className="group-item">
            <img src={previewImage} alt={name} className="image"/>
            <div className="group-wrapper">
                <h2>{name}</h2>
                <p>
                    {about}
                </p>
                <p>
                    {status}
                </p>
                <p>
                    Location: {state}, {city}
                </p>

                <p>
                {type}
                </p>
            </div>
        </li>

        </NavLink>
       
    )
 }
 export default Group