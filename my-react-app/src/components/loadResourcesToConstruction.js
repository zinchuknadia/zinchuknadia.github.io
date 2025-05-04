async function loadResourcesToConstruction() {
    let resources = JSON.parse(localStorage.getItem('resources'));
  
    // If localStorage is empty, fetch from JSON file
    if (!resources) {
        const response = await fetch('../data/resources.json');
        resources = await response.json();
        localStorage.setItem('resources', JSON.stringify(resources));
    }
  
    displayResourcesToConstruction(resources);
  }

  function displayResourcesToConstruction(resources) {
    const resourceContainer = document.getElementById('resource-list');
    resourceContainer.innerHTML = '';

    let i = 0;
    do{
      let resource = resources[i];

      if(resource.name === "Budget"){
        loadBudgetToConstruction(resource);
        i++;
        continue;
      }

      const resourceElement = document.createElement('div');
      resourceElement.classList.add('resource');
      resourceElement.innerHTML = `
        <img src="${resource.image}" alt="Resource">
        <div class="resource-info" data-id="${resource.id}">
          <h4>${resource.name} ${resource.emoji}</h4>
          <p>$${resource.price}</p> 
          <p class="amount">x${resource.quantity}</p>
          <button class="buyButton">Buy</button>
        </div>
      `;
      resourceContainer.appendChild(resourceElement);
      setupBuyButton(resourceElement);

      i++;
    }while (i < resources.length);
  }

  function setupBuyButton(resourceElement) {
    const buyBtn = resourceElement.querySelector('.buyButton');
    const infoBlock = resourceElement.querySelector('.resource-info');
    const id = Number(infoBlock.dataset.id);
    // Get resource name

    buyBtn.addEventListener('click', () => {
      const data = JSON.parse(localStorage.getItem('resources'));
      console.log('Searching for id:', id);
      console.log('LocalStorage data:', data);

      const budget = data.find(r => r.name === "Budget");
      const resource = data.find(r => r.id === id); // Match resource by id

      if (budget.quantity >= resource.price) {
        budget.quantity -= resource.price;
        resource.quantity += 1;

        localStorage.setItem('resources', JSON.stringify(data));
        loadResourcesToConstruction(); // Refresh view
      } else {
        alert("Not enough budget to buy this resource.");
      }
    });
  }

  function loadBudgetToConstruction(resource) {
    const budgetElement = document.getElementById('budget');
    budgetElement.innerHTML = `
      <img src="${resource.image}" alt="Budget">
      <div class="budget-description">
        <p id="budget-amount-display">$${resource.quantity}</p>
        <div class="budget-control">
          <input type="number" id="budget-amount" name="budget-amount" value="1" />
          <div class="budget-control-buttons">
            <button id="decrease-budget">-</button>
            <button id="increase-budget">+</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('increase-budget').addEventListener('click', () => {
      updateBudget('add');
    });
  
    document.getElementById('decrease-budget').addEventListener('click', () => {
      updateBudget('subtract');
    });
  }

  function updateBudget(action) {
    let data = JSON.parse(localStorage.getItem('resources'));
    const budget = data.find(r => r.name === "Budget");
    const inputAmount = parseInt(document.getElementById('budget-amount').value) || 1;
  
    if (action === 'add') {
      budget.quantity += inputAmount;
    } else if (action === 'subtract') {
      if (budget.quantity >= inputAmount) {
        budget.quantity -= inputAmount;
      } else {
        alert("Not enough budget to subtract this amount.");
        return;
      }
    }
  
    localStorage.setItem('resources', JSON.stringify(data));
    document.getElementById('budget-amount-display').textContent = `$${budget.quantity}`;
  }
    
  document.addEventListener('DOMContentLoaded', loadResourcesToConstruction);
  document.addEventListener('DOMContentLoaded', setupBuyButton);

