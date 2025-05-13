import React, { useEffect, useState } from 'react';
import { useGameData } from '../contexts/GameDataContext'; // Adjust path as needed

const InfrastructureList = () => {
  const [infrastructure, setInfrastructure] = useState([]);
  const { resources, deductResources } = useGameData();

  // Load infrastructure from localStorage or JSON
  useEffect(() => {
    const loadInfrastructure = async () => {
      let infra = JSON.parse(localStorage.getItem('infrastructure'));

      if (!infra) {
        const response = await fetch(`${process.env.PUBLIC_URL}/data/infrastructure.json`);
        infra = await response.json();
        localStorage.setItem('infrastructure', JSON.stringify(infra));
      }

      setInfrastructure(infra);
    };

    loadInfrastructure();
  }, []);

  const saveInfrastructure = (infra) => {
    localStorage.setItem('infrastructure', JSON.stringify(infra));
  };

  const handleUpgrade = (index) => {
    const infraCopy = [...infrastructure];
    const building = infraCopy[index];
    const currentLevel = building.level || 1;
    const nextLevel = currentLevel + 1;
    const nextLevelData = building.levels?.find(l => l.level === nextLevel);

    if (!nextLevelData) return;

    // Use context function to check and deduct resources
    const success = deductResources(nextLevelData.neededResources);

    if (!success) {
      alert("Not enough resources to upgrade!");
      return;
    }

    // Upgrade building
    building.level = nextLevel;
    building.image = nextLevelData.image;

    setInfrastructure(infraCopy);
    saveInfrastructure(infraCopy);
  };

  return (
    <div id="infrastructure-list">
      {infrastructure.map((infra, index) => {
        const currentLevel = infra.level || 1;
        const levelData = infra.levels?.find(l => l.level === currentLevel);
        const nextLevelData = infra.levels?.find(l => l.level === currentLevel + 1);

        return (
          <div key={index} className="infrastructure">
            <img src={`${process.env.PUBLIC_URL}/${levelData?.image || infra.image}`} alt={infra.name} />
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
    </div>
  );
};

export default InfrastructureList;
