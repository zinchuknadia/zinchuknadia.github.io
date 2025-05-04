function buildStructure(building) {
  let resources = JSON.parse(localStorage.getItem("resources")) || [];
  let infrastructure = JSON.parse(localStorage.getItem("infrastructure")) || [];

  // Check if there are enough resources
  const canBuild = building.levels[0].neededResources.every(req => {
    const resource = resources.find(r => r.id === req.id);
    return resource && resource.quantity >= req.amount;
  });

  if (!canBuild) {
    alert("Not enough resources to build " + building.name);
    return false;
  }

  // Deduct resources
  building.levels[0].neededResources.forEach(req => {
    const resource = resources.find(r => r.id === req.id);
    if (resource) {
      resource.quantity -= req.amount;
    }
  });

  // Save updated resources
  localStorage.setItem("resources", JSON.stringify(resources));
  displayResourcesToConstruction(resources);

 // Generate a unique ID
//  let infraCounter = parseInt(localStorage.getItem("infraCounter")) || 1;
//  const uniqueId = infraCounter;
//  localStorage.setItem("infraCounter", infraCounter + 1);

//  const newInfrastructure = {
//    id: uniqueId,
//    name: building.name,
//    image: building.image,
//    type: building.type || "Unknown",
//    level: 1,
//    position: null,
//    builtAt: new Date().toISOString()
//  };

//   infrastructure.push(newInfrastructure);
//   localStorage.setItem("infrastructure", JSON.stringify(infrastructure));

//   // Optional: update UI
//   displayInfrastructure(); // You’ll need to define this
  return true;
}
