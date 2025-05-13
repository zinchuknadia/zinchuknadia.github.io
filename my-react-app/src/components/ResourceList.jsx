// src/components/ResourceList.jsx
import React from "react";
import { useGameData } from "../contexts/GameDataContext";

const ResourceList = () => {
  const { resources } = useGameData();

  

  return (
    <div id="resource-list">
      {resources.map((resource, index) => (
        <div key={index} className="resource-card">
          <label className="resource-info">{resource.name}</label>
          <div className="resource-info">
            <img
              src={`${process.env.PUBLIC_URL}/${resource.image}`}
              alt={resource.name}
            />
            <div className="resource-details">
              <p>{resource.description}</p>
              <p className="quantity">x{resource.quantity}</p>
              <p className="price">${resource.price}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourceList;
