import { React, useContext } from "react";
import { NavLink as Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";

function Navbar() {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const logoutbtn = {
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    outline: "none",
    backgroundColor: "#6b1d1d",
  };

  const renderNavList = () => {
    if (state) {
      return [
        <button key={1}
          style={logoutbtn}
          name="action"
          onClick={() => {
            localStorage.clear();
            dispatch({ type: "CLEAR" });
            history.push("/");
          }}
        >
          Logout
        </button>,
        <li key={2}>
          <Link to="/viewprofile">viewProfile</Link>
        </li>,
        <li key={3}>
          <Link to="/postdestination">Post Destination</Link>
        </li>,
        <li key={4}>
          <Link to="/inbox">Inbox</Link>
        </li>,
        <li key={5}>
          <Link to="/friendList">My friends</Link>
        </li>,
      ];
    } else {
      return [
        <li key={6}>
          <Link to="/signin">Sign In</Link>
        </li>,
        <li key={7}>
          <Link to="/signup">Register</Link>
        </li>,
      ];
    }
  };

  return (
    <nav className="nav-wrapper grey darken-1 ">
      <div className="nav-wrapper">
        <Link to={state ? "/home" : "/"} className="brand-logo right">
          GlobeTrotter
        </Link>
        <ul className="left">{renderNavList()}</ul>
      </div>
    </nav>
  );
}

export default Navbar;
