import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive((prev) => !prev);
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
      </ul>
      <button className="log-in">Log in</button>
    </nav>
  );
};

export default Navbar;
