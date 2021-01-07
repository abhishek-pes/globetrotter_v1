import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav className="grey darken-1 ">
            <div className="nav-wrapper">
                <Link to="/" className="brand-logo right">GT</Link>
                <ul className="left">
                    <li><Link to="/signin">Sign In</Link></li>
                    <li><Link to="/signout">Sign Out</Link></li>
                    <li><Link to="/signup">Register</Link></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
