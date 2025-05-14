import React, { useEffect, useState } from "react";
import { useGameData } from "../contexts/GameDataContext";
import ResetInfrastructureButton from "./ResetInfrastructureButton"; // adjust path as needed

const InfrastructureList = () => {
  const [infrastructure, setInfrastructure] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState(["All"]);
  const [showMenu, setShowMenu] = useState(false);
  const { resources, deductResources } = useGameData();

  const loadInfrastructure = async () => {
    let infra = JSON.parse(localStorage.getItem("infrastructure"));

    if (!infra) {
      const response = await fetch(
        `${process.env.PUBLIC_URL}/data/infrastructure.json`
      );
      infra = await response.json();
      localStorage.setItem("infrastructure", JSON.stringify(infra));
    }

    setInfrastructure(infra);
  };

  useEffect(() => {
    loadInfrastructure();
  }, []);

  const saveInfrastructure = (infra) => {
    localStorage.setItem("infrastructure", JSON.stringify(infra));
  };

  const handleUpgrade = (index) => {
    const infraCopy = [...infrastructure];
    const building = infraCopy[index];
    const currentLevel = building.level || 1;
    const nextLevel = currentLevel + 1;
    const nextLevelData = building.levels?.find((l) => l.level === nextLevel);

    if (!nextLevelData) return;

    const success = deductResources(nextLevelData.neededResources);

    if (!success) {
      alert("Not enough resources to upgrade!");
      return;
    }

    building.level = nextLevel;
    building.image = nextLevelData.image;

    setInfrastructure(infraCopy);
    saveInfrastructure(infraCopy);
  };

  const filteredInfrastructure = selectedTypes.includes("All")
    ? infrastructure
    : infrastructure.filter((b) => selectedTypes.includes(b.type));

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

      <div id="infrastructure-list">
        {filteredInfrastructure.map((infra, index) => {
          const currentLevel = infra.level || 1;
          const levelData = infra.levels?.find((l) => l.level === currentLevel);
          const nextLevelData = infra.levels?.find(
            (l) => l.level === currentLevel + 1
          );

          return (
            <div key={index} className="infrastructure">
              <img
                src={`${process.env.PUBLIC_URL}/${
                  levelData?.image || infra.image
                }`}
                alt={infra.name}
              />
              <div className="infrastructure-info">
                <h4>{infra.name}</h4>
                <p>Level: {infra.level}</p>
                {nextLevelData ? (
                  <button onClick={() => handleUpgrade(index)}>Improve</button>
                ) : (
                  <p>Max level reached</p>
                )}
              </div>
            </div>
          );
        })}
        <ResetInfrastructureButton onReset={loadInfrastructure} />
      </div>
    </>
  );
};

export default InfrastructureList;
