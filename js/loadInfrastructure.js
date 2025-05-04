
async function loadInfrastructure(){
    let infrastructure = JSON.parse(localStorage.getItem('infrastructure')) || [];
    let resources = JSON.parse(localStorage.getItem('resources')) || [];
    
    // If localStorage is empty, fetch from JSON file
    if (!infrastructure) {
        let response = await fetch('../data/infrastructure.json');
        infrastructure = await response.json();
        localStorage.setItem('infrastructure', JSON.stringify(infrastructure));
    }
    if (!resources) {
        let response = await fetch('../data/resources.json');
        resources = await response.json();
        localStorage.setItem('resources', JSON.stringify(resources));
    }
    
    displayInfrastructure(infrastructure, resources);
}

function displayInfrastructure(infrastructure, resources) {
    const infrastructureContainer = document.getElementById('infrastructure-list');
    infrastructureContainer.innerHTML = '';

    infrastructure.forEach((infra, index) => {
        const infraElement = document.createElement('div');
        infraElement.classList.add('infrastructure');

        const currentLevel = infra.level || 1;
        const levelData = infra.levels?.find(l => l.level === currentLevel);
        const nextLevelData = infra.levels?.find(l => l.level === currentLevel + 1);

        infraElement.innerHTML = `
            <img src="${levelData?.image || infra.image}" alt="${infra.name}">
            <div class="infrastructure-info">
                <h4>${infra.name}</h4>
                <p>Level: ${infra.level}</p>
                ${nextLevelData ? `<button class="ImproveBtn" data-index="${index}">Improve</button>` : `<p>Max level reached</p>`}
            </div>
        `;
        infrastructureContainer.appendChild(infraElement);
    });

    document.querySelectorAll('.ImproveBtn').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            upgradeBuilding(infrastructure[index], resources);
            saveToLocalStorage(infrastructure, resources);
            displayInfrastructure(infrastructure, resources); // refresh display
        });
    });
}

function upgradeBuilding(building, resources) {
    const currentLevel = building.level || 1;
    const nextLevel = currentLevel + 1;
    const nextLevelData = building.levels?.find(l => l.level === nextLevel);
    if (!nextLevelData) return;

    const canUpgrade = nextLevelData.neededResources.every(req => {
        const resource = resources.find(r => r.id === req.id);
        return resource && resource.quantity >= req.amount;
    });

    if (!canUpgrade) {
        alert("Not enough resources to upgrade!");
        return;
    }

    // Deduct resources
    nextLevelData.neededResources.forEach(req => {
        const resource = resources.find(r => r.id === req.id);
        if (resource) {
            resource.quantity -= req.amount;
        }
    });

    // Upgrade building
    building.level = nextLevel;
    building.image = nextLevelData.image;
}

function saveToLocalStorage(infrastructure, resources) {
    localStorage.setItem('infrastructure', JSON.stringify(infrastructure));
    localStorage.setItem('resources', JSON.stringify(resources));
}


document.addEventListener('DOMContentLoaded', loadInfrastructure);