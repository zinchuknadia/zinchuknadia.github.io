import CityMap from './CityMap.js';

const cityMap = new CityMap('construction-map', 20, 20);
const indexMap = new CityMap('index-map', 20, 20);
const constructionFooterMap = new CityMap('construction-footer-map',20, 20);
const indexFooterMap = new CityMap('index-footer-map', 20, 20);
const resourcesFooterMap = new CityMap('resources-footer-map', 20, 20);

async function initMaps(){
  if (document.getElementById('construction-map')) {
    cityMap.initGrid();
  }
  if (document.getElementById('construction-footer-map')) {
    constructionFooterMap.initGrid();
  }
  if (document.getElementById('index-footer-map')) {
    indexFooterMap.initGrid();
  }
  if (document.getElementById('resources-footer-map')) {
    resourcesFooterMap.initGrid();
  }
  if (document.getElementById('index-map')) {
    indexMap.initGrid();
  }
}

document.addEventListener('DOMContentLoaded', initMaps);

export { cityMap,indexMap, constructionFooterMap, indexFooterMap, resourcesFooterMap };
