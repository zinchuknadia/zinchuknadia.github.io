import React from "react";
import { useGameData } from "../../contexts/GameDataContext";
import Resource from "./Resource";

const ResourceList = () => {
  const { resources } = useGameData();

  console.log("Resources in ResourceList:", resources);

  return (
    <div id="resource-list">
      {resources.map((resource) => (
        <Resource key={resource.id} resource={resource} />
      ))}
    </div>
  );
};

export default ResourceList;
