import React, { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CityMap from "../components/CityMap.jsx";

import CitySatisfaction from "../components/home/CitySatisfaction.jsx";
import RatingForm from "../components/home/RatingForm.jsx";

import "../styles/index.css";
import "../styles/index-header.css";
import "../styles/general.css";
import "../styles/navbar.css";

import InfrastructureList from "../components/home/InfrastructureList.jsx";

const AboutPage = () => {
  const [satisfaction, setSatisfaction] = useState(70); // initial value

  const handleRatingSubmit = (rating) => {
    // Simple formula: newSatisfaction = avg of current and rating * 20
    const newSatisfaction = Math.round((satisfaction + rating * 20) / 2);
    setSatisfaction(newSatisfaction);
  };
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
            <InfrastructureList />
            <div className="more-button-container">
              <button className="more-button">More</button>
            </div>
          </div>
        </section>

        <section className="city-feedback">
          <div className="feedback-container">
            <CitySatisfaction satisfaction={satisfaction} />
            <RatingForm onSubmit={handleRatingSubmit} />
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default AboutPage;
