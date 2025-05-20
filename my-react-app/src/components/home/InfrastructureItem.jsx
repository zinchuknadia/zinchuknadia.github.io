import React from "react";

const InfrastructureItem = ({ infra, index, handleUpgrade }) => {
  const currentLevel = infra.level || 1;
  const levelData = infra.levels?.find((l) => l.level === currentLevel);
  const nextLevelData = infra.levels?.find((l) => l.level === currentLevel + 1);

  return (
    <div className="infrastructure">
      <img
        src={`${process.env.PUBLIC_URL}/${levelData?.image || infra.image}`}
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
};

export default InfrastructureItem;
