import React from "react";

const BuildingItem = ({ building, onBuild }) => {
  return (
    <div className="building">
      <img
        className="building-banner"
        src={`${process.env.PUBLIC_URL}/${building.levels[building.level].image}`}
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
  );
};

export default BuildingItem;
