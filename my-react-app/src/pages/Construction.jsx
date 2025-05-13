// src/pages/Construction.jsx
import { useEffect, useRef } from "react";
import { GameDataProvider } from "../contexts/GameDataContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BuildingList from "../components/construction/BuildingList";
import ResourceShop from "../components/construction/ResourceShop";
import CityMap from "../components/CityMap";

import "../styles/construction.css";
import "../styles/buildings-list.css";
import "../styles/resource-list.css";
import "../styles/list-block.css";
import "../styles/general.css";

const Construction = () => {
  const cityMapRef = useRef();

  const handleBuild = (building) => {
    const success = cityMapRef.current?.placeBuilding(building);
    if (success) {
      console.log("✅ Побудовано:", building.name);
    }
  };

  return (
    <GameDataProvider>
      <Navbar />
      <main className="overlay">
        <header className="construction-header">
          <div className="hero-banner">
            <h1>Build Hope Land</h1>
            <button>Start Now</button>
          </div>
        </header>

        <div className="elements-container">
          <div id="construction-map-container" className="map-container">
            <CityMap
              ref={cityMapRef}
              id="construction-map"
              rows={20}
              cols={20}
            />
          </div>

          <section className="buildings-manager">
            <h2>Buildings</h2>
            <div className="building-section">
              <input type="search" id="building-filter" name="q" />
              <BuildingList onBuild={handleBuild} />
            </div>
          </section>
        </div>

        <div className="elements-container">
          <ResourceShop />
        </div>
      </main>
      <Footer />
    </GameDataProvider>
  );
};

export default Construction;
