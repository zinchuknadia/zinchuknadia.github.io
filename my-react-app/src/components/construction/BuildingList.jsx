import React, { useEffect, useState } from "react";
// import { useGameData } from "../../contexts/GameDataContext";
import ResetBuildingsButton from "./ResetBuildingsButton";
import BuildingFilter from "../BuildingFilter";
import BuildingItem from "./BuildingItem";

const BuildingList = ({ onBuild }) => {
  const [buildings, setBuildings] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState(["All"]);
  const [showMenu, setShowMenu] = useState(false);
  // const { resources } = useGameData();

  const loadBuildings = async () => {
    let stored = JSON.parse(localStorage.getItem("buildings-avaliable"));

    if (!stored) {
      const response = await fetch(
        `${process.env.PUBLIC_URL}/data/buildings-avaliable.json`
      );
      stored = await response.json();
      localStorage.setItem("buildings-avaliable", JSON.stringify(stored));
    }

    setBuildings(stored);
  };

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
        <ResetBuildingsButton onReset={loadBuildings} />
      </div>
    </>
  );
};

export default BuildingList;
