import CityMap from './CityMap.js'; // adjust path if needed

const cityMap = new CityMap('map', 10, 10,600); // adjust size if needed
cityMap.initGrid(); // Initialize the grid
cityMap.addListeners(); // Add event listeners