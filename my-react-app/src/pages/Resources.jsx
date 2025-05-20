// import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ResourceList from "../components/resources/ResourceList";

import "../styles/resources.css";
import "../styles/resource-card.css";
import "../styles/general.css";
import "../styles/footer.css";
import "../styles/navbar.css";

const ConstructionPage = () => {

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

      <Footer />
    </>
  );
};

export default ConstructionPage;
