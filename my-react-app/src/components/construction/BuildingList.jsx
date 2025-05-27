import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../configuration/Firebase";

import { uploadBuildingsData } from "../../uploadData/uploadBuildingsData";

import ResetBuildingsButton from "./ResetBuildingsButton";
import BuildingFilter from "../BuildingFilter";
import BuildingItem from "./BuildingItem";


const BuildingList = ({ onBuild }) => {
  const [buildings, setBuildings] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState(["All"]);
  const [showMenu, setShowMenu] = useState(false);

  const loadBuildings = async () => {
    try {
      const buildingsFromDb = await fetchBuildingTemplates();
      setBuildings(buildingsFromDb);
    } catch (error) {
      console.error("Error loading building templates:", error);
    }
  };  

  async function fetchBuildingTemplates() {
    const templatesCol = collection(db, "buildingTemplates");
    const snapshot = await getDocs(templatesCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }  

  useEffect(() => {
    loadBuildings();
  }, []);

  const filteredBuildings = selectedTypes.includes("All")
    ? buildings
    : buildings.filter((b) => selectedTypes.includes(b.type));

  return (
    <>
      <BuildingFilter
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />

      <div id="building-list">
        {filteredBuildings.map((building, index) => (
          <BuildingItem key={index} building={building} onBuild={onBuild} />
        ))}
        {/* <ResetBuildingsButton onReset={loadBuildings} /> */}
        <button className="upload-button" onClick={uploadBuildingsData}>
          Upload Buildings Data
        </button>
      </div>
    </>
  );
};

export default BuildingList;
