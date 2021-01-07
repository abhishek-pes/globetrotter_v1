import { React, useContext, useEffect } from 'react'
import { NavLink as Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'

function Navbar() {
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    const logoutbtn = {
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        outline: "none",
        backgroundColor: "#6b1d1d",
    }

    const renderNavList = () => {
        if (state) {
            return ([
                <button style={logoutbtn} name="action"
                    onClick={() => {
                        localStorage.clear()
                        dispatch({ type: 'CLEAR' })
                        history.push('/')
                    }}>Logout
                    </button>,
                <li><Link to="/viewprofile">viewProfile</Link></li>,
                <li><Link to="/postdestination">Post Destination</Link></li>,
            ]
            )
        }
        else {
            return ([
                <li><Link to="/signin">Sign In</Link></li>,
                <li><Link to="/signup">Register</Link></li>
            ])

        }
    }

    return (
        <nav className="nav-wrapper grey darken-1 ">
            <div className="nav-wrapper">
                <Link to={state ? "/home" : "/"} className="brand-logo right">GlobeTrotter</Link>
                <ul className="left">
                    {renderNavList()}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
