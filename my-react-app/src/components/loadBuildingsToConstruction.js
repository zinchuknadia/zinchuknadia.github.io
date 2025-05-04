import { cityMap } from './loadMap.js';
import { constructionFooterMap } from './loadMap.js';
import { indexFooterMap } from './loadMap.js';
import { resourcesFooterMap } from './loadMap.js';

document.getElementById('resetBuildings').addEventListener('click', () => {
  localStorage.removeItem("buildings-avaliable");
  loadBuildingsToConstruction();
});

async function loadBuildingsToConstruction() {
  let buildings = JSON.parse(localStorage.getItem('buildings-avaliable'));

  // If localStorage is empty, fetch from JSON file
  if (!buildings) {
      const response = await fetch('../data/buildings-avaliable.json');
      buildings = await response.json();
      localStorage.setItem('buildings-avaliable', JSON.stringify(buildings));
  }

  displayBuildingsToConstruction(buildings);
}

function displayBuildingsToConstruction(buildings) {
  const buildingContainer = document.getElementById('building-list');
  buildingContainer.innerHTML = '';

  let i = 0;
  do{
    let building = buildings[i];

    const buildingElement = document.createElement('div');
    buildingElement.classList.add('building');
    buildingElement.innerHTML = `
      <img class="building-banner" src="${building.levels[building.level].image}" alt="City banner">
      <div class="building-info">
        <h4>${building.name}</h4> 
        <div class="building-resource-list"></div>                  
        <button class="build-btn">Build</button>
      </div>
    `;

    const buildBtn = buildingElement.querySelector('.build-btn');
    buildBtn.addEventListener('click', () => {
      const success = cityMap.placeBuilding(building);

      if (success){
        constructionFooterMap.loadStoredBuildings(); // Re-render markers
        indexFooterMap.loadStoredBuildings(); // Re-render markers
        resourcesFooterMap.loadStoredBuildings(); // Re-render markers
      }else{
        return;
      }

      // buildStructure(building);
    });

    buildingContainer.appendChild(buildingElement);

    displayResources(building.levels[0].neededResources);

    i++;
  }while (i < buildings.length);
}

function displayResources(resources)
{
  const resourceContainer = document.querySelector('.building:last-child .building-resource-list');
  resourceContainer.innerHTML = '';

  let j = 0;
  do{
    let resource = resources[j];

    const resourceElement = document.createElement('div');
    resourceElement.classList.add('building-resource');
    resourceElement.innerHTML = `
      <p>${resource.emoji}</p>
      <p>${resource.amount}</p>
    `;
    if (resourceContainer) {
      resourceContainer.appendChild(resourceElement);
    }
    
    j++;
  }while( j < resources.length);
}

document.addEventListener('DOMContentLoaded', loadBuildingsToConstruction);