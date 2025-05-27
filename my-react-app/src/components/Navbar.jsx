import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive((prev) => !prev);
  };

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const handleNavigate = () => {
    if (user) {
      navigate(`/user/${user.uid}`);
    } else {
      navigate("/SignUp");
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={`${process.env.PUBLIC_URL}/assets/logo3.png`} alt="Logo" />
        <h4>Hope Land</h4>
      </Link>
      <button className="menu-toggle" id="menu-toggle" onClick={toggleMenu}>
        &#8801;
      </button>
      <ul className={`nav-links ${menuActive ? "active" : ""}`} id="nav-links">
        <li>
          <Link to="/">My City</Link>
        </li>
        <li>
          <Link to="/construction">Construction</Link>
        </li>
        <li>
          <Link to="/resources">Resources</Link>
        </li>

        {user ? (
          <li>
            <Link to={`/user/${user.uid}`} className="log-in">
              {user.displayName || user.email}
            </Link>
          </li>
        ) : (
          <li>
            <span onClick={handleNavigate} className="log-in">
              Log in
            </span>
          </li>
        )}

      </ul>
    </nav>
  );
};

export default Navbar;
