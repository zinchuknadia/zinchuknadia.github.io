import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ResourceList from "../components/ResourceList";

import "../styles/resources.css";
import "../styles/resource-card.css";
import "../styles/general.css";
import "../styles/footer.css";
import "../styles/navbar.css";

const ConstructionPage = () => {
  // const resetResources = async () => {
  //   localStorage.removeItem("resources");
  //   if (window.loadResources) {
  //     await window.loadResources();
  //   }
  // };

  // const resetBuildings = async () => {
  //   localStorage.removeItem("buildings-available");
  //   if (window.loadBuildings) {
  //     await window.loadBuildings();
  //   }
  // };

  return (
    <>
      <Navbar />
      <main>
        <header className="resources-header">
          <div className="section-banner">
            <h2>City resources</h2>
          </div>
        </header>

        <section>
          <ResourceList />
        </section>
      </main>

      <Footer
        // onResetResources={resetResources}
        // onResetBuildings={resetBuildings}
      />
    </>
  );
};

export default ConstructionPage;
