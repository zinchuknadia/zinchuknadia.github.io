import React, { useEffect, useState } from "react";
import { useGameData } from "../../contexts/GameDataContext";
import ResetBuildingsButton from "../ResetBuildingsButton";

const BuildingList = ({ onBuild }) => {
  const [buildings, setBuildings] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState(["All"]);
  const [showMenu, setShowMenu] = useState(false);
  const { resources } = useGameData();

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
      {/* Filter button */}
      <div className="building-filter">
        <button onClick={() => setShowMenu((prev) => !prev)}>
          <img
            src={`${process.env.PUBLIC_URL}/assets/filter.svg`}
            alt="Filter"
            style={{ width: "24px", height: "24px" }}
          />
          Filter
        </button>
        {showMenu && (
          <div className="filter-menu">
            {["All", "Infrastructure", "Commercial", "Public"].map((type) => (
              <label
                key={type}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.3rem",
                }}
              >
                <input
                  type="checkbox"
                  value={type}
                  checked={selectedTypes.includes(type)}
                  onChange={() => {
                    if (type === "All") {
                      setSelectedTypes(["All"]);
                    } else {
                      setSelectedTypes((prev) => {
                        const withoutAll = prev.filter((t) => t !== "All");
                        if (prev.includes(type)) {
                          const updated = withoutAll.filter((t) => t !== type);
                          return updated.length === 0 ? ["All"] : updated;
                        } else {
                          return [...withoutAll, type];
                        }
                      });
                    }
                  }}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div id="building-list">
        {filteredBuildings.map((building, index) => (
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
        <ResetBuildingsButton onReset={loadBuildings} />
      </div>
    </>
  );
};

export default BuildingList;
