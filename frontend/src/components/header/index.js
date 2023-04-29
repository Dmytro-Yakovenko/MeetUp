import { NavLink } from "react-router-dom"


function Header({ isLoaded }) {
    return (
        <header>
            <NavLink to="/">
                <h1>MEET UP</h1>
            </NavLink>
            <div>
                {!isLoaded &&
                    (
                        <>
                            <NavLink to="/login">
                                Log In
                            </NavLink>
                            <NavLink to="/signup">
                                Sign Up
                            </NavLink>
                        </>
                    )

                }
{
    isLoaded && 
    <NavLink to="/logout">
    Log Out
    </NavLink>
}

            </div>

        </header>
    )
}

export default Header