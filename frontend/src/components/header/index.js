import { NavLink } from "react-router-dom"


function Header(){
    return (
        <header>
            <NavLink to="/">
            <h1>MEET UP</h1>
            </NavLink>
           <div>
        <NavLink to="/login">
        Log In
        </NavLink>
        <NavLink to="/signup">
        Sign Up
        </NavLink>
           
           </div>
        
        </header>
    )
}

export default Header