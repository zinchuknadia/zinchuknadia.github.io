import React, { useEffect } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CityMap from "../components/CityMap.jsx";

import "../styles/index.css";
import "../styles/index-header.css";
import "../styles/general.css";
import "../styles/navbar.css";

import InfrastructureList from "../components/InfrastructureList.jsx";

const AboutPage = () => {
//   useEffect(() => {
//     const loadScripts = async () => {
//       await import("../utils/loadInfrastructure.js");
//     };

//     loadScripts();
//   }, []);

//   const resetInfrastructure = async () => {
//     localStorage.removeItem("infrastructure");
//     localStorage.removeItem("infraCounter");
//     const { default: loadInfrastructure } = await import(
//       "../utils/loadInfrastructure.js"
//     );
//     await loadInfrastructure();
//   };

  return (
    <>
      <Navbar />
      <main>
        <header className="index-header">
          <CityMap id="index-map" rows={20} cols={20} />
          <div className="header-city-info">
            <h1>Hope Land</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              facilisi. Proin sed lorem non nunc pharetra ullamcorper. Lorem
              ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.
              Proin sed lorem non nunc pharetra ullamcorper. Lorem ipsum dolor
              sit amet, consectetur adipiscing elit. Nulla facilisi. Proin sed
              lorem non nunc pharetra ullamcorper.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              facilisi. Proin sed lorem non nunc pharetra ullamcorper. Lorem
              ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.
              Proin sed lorem non nunc pharetra ullamcorper. Lorem ipsum dolor
              sit amet, consectetur adipiscing elit. Nulla facilisi. Proin sed
              lorem non nunc pharetra ullamcorper.
            </p>
          </div>
        </header>
        <section className="city-infrastructure">
          <label htmlFor="city-objects">Infrastructure</label>
          <div className="list-block" id="city-objects">
            <div className="filter-row">
              <input type="search" id="filter-search" name="q" />
            </div>
              <InfrastructureList />
            <div className="more-button-container">
              <button className="more-button">More</button>
            </div>
          </div>
        </section>
      </main>
      <Footer /*resetInfrastructure={resetInfrastructure}*/ />
    </>
  );
};

export default AboutPage;
