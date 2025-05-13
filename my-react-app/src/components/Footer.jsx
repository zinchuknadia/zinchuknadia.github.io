import React from "react";
import "../styles/footer.css";
import CityMap from "./CityMap";

const Footer = () => {
  return (
    <footer>
      <div className="city-info">
        <img src={`${process.env.PUBLIC_URL}/assets/logo3.png`} alt="Logo" />
        <h3>Hope Land</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
          facilisi. Proin sed lorem non nunc pharetra ullamcorper.
        </p>
      </div>
      <div className="links">
        <label htmlFor="quick-links">Quick links</label>
        <ul className="quick-links">
          <li>
            <a href="/">My City</a>
          </li>
          <li>
            <a href="/construction">Construction</a>
          </li>
          <li>
            <a href="/resources">Resources</a>
          </li>
        </ul>
      </div>
      <CityMap id="footer-map" rows={20} cols={20} />
    </footer>
  );
};

export default Footer;
