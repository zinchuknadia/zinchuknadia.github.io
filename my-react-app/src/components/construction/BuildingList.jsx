import React, { useEffect, useState } from "react";
import { useGameData } from "../../contexts/GameDataContext";

const BuildingList = ({ onBuild }) => {
  const [buildings, setBuildings] = useState([]);
  const { resources, updateResources } = useGameData();

  useEffect(() => {
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

    loadBuildings();
  }, []);

  return (
    <div>
      <div id="building-list">
        {buildings.map((building, index) => (
          <div key={index} className="building">
            <img
              className="building-banner"
              src={`${process.env.PUBLIC_URL}/${
                building.levels[building.level].image
              }`}
              alt="City banner"
            />
            <div className="building-info">
              <h4>{building.name}</h4>
              <div className="building-resource-list">
                {building.levels[0].neededResources.map((res, idx) => (
                  <div key={idx} className="building-resource">
                    <p>{res.emoji}</p>
                    <p>{res.amount}</p>
                  </div>
                ))}
              </div>
              <button className="build-btn" onClick={() => onBuild(building)}>
                Build
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuildingList;
