import React from "react";
import { useGameData } from "../../contexts/GameDataContext";
import Resource from "./Resource";

const ResourceList = () => {
  const { resources } = useGameData();

  return (
    <div id="resource-list">
      {resources.map((resource, index) => (
        <Resource key={index} resource={resource} />
      ))}
    </div>
  );
};

export default ResourceList;
