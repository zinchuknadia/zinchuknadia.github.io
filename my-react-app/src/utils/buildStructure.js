// import { displayResourcesToConstruction } from "./loadResourcesToConstruction";

export function buildStructure(building) {
  let resources = JSON.parse(localStorage.getItem("resources")) || [];

  const canBuild = building.levels[0].neededResources.every(req => {
    const res = resources.find(r => r.id === req.id);
    return res && res.quantity >= req.amount;
  });

  if (!canBuild) {
    alert("Not enough resources to build " + building.name);
    return false;
  }

  // Deduct and update
  building.levels[0].neededResources.forEach(req => {
    const resource = resources.find(r => r.id === req.id);
    if (resource) resource.quantity -= req.amount;
  });

  localStorage.setItem("resources", JSON.stringify(resources));
  // displayResourcesToConstruction(resources); // update UI or emit event
  return true;
}
