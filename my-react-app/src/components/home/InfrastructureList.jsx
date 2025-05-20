import React, { useEffect, useState } from "react";
import { useGameData } from "../../contexts/GameDataContext";
import ResetInfrastructureButton from "./ResetInfrastructureButton";
import InfrastructureItem from "./InfrastructureItem";
import BuildingFilter from "../BuildingFilter"; 

const InfrastructureList = () => {
  const [infrastructure, setInfrastructure] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState(["All"]);
  const [showMenu, setShowMenu] = useState(false);
  const { deductResources } = useGameData();

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
        <BuildingFilter
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
        />
  
        <div id="infrastructure-list">
          {filteredInfrastructure.map((infra, index) => (
            <InfrastructureItem
              key={index}
              infra={infra}
              index={index}
              handleUpgrade={handleUpgrade}
            />
          ))}
          <ResetInfrastructureButton onReset={loadInfrastructure} />
        </div>
      </>
    );
  };

export default InfrastructureList;
