import { useGameData } from "../contexts/GameDataContext";

export function useBuildStructure() {
  const { resources, deductResources } = useGameData();

  const buildStructure = (building) => {
    const needed = building.levels[0].neededResources;

    const success = deductResources(needed);
    if (!success) {
      alert("Not enough resources to build " + building.name);
    }

    return success;
  };

  return buildStructure;
}
