import React from "react";

const InfrastructureItem = ({ infra, isOwner, handleUpgrade }) => {
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
          <button
          onClick={isOwner ? handleUpgrade : null} // Only allow click if the user is the owner
          className={`improve-button ${!isOwner ? "disabled" : ""}`} // Add a "disabled" class if not the owner
          disabled={!isOwner} // Disable the button if not the owner
        >
          Improve
        </button>
        ) : (
          <p>Max level reached</p>
        )}
      </div>
    </div>
  );
};

export default InfrastructureItem;
