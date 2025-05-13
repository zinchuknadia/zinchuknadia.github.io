async function loadResources() {
  let resources = JSON.parse(localStorage.getItem('resources'));

  // If localStorage is empty, fetch from JSON file
  if (!resources) {
      const response = await fetch('../data/resources.json');
      resources = await response.json();
      localStorage.setItem('resources', JSON.stringify(resources));
  }

  displayResources(resources);
}

function displayResources(resources) {
  const resourceContainer = document.getElementById('resource-list');
  resourceContainer.innerHTML = '';

  let i = 0;
  do {
      let resource = resources[i];

      const resourceElement = document.createElement('div');
      resourceElement.classList.add('resource');
      resourceElement.innerHTML = `
          <label for class = "resource-info">${resource.name}</label>
          <div class="resource-info">
            <img src="${resource.image}" alt="${resource.name}">
            <div class="resource-details">
              <p>${resource.description}</p>
              <p class="quantity">x${resource.quantity}</p>
              <p class="price">$${resource.price}</p>
            </div>
          </div>
      `;
      resourceContainer.appendChild(resourceElement);

      i++;
  } while (i < resources.length);
}


document.addEventListener('DOMContentLoaded', loadResources);


