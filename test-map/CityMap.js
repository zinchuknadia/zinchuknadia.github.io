export default class CityMap {
  constructor(mapElementId, rows = 10, cols = 10, mapContainerSize) {
    this.mapElement = document.getElementById(mapElementId);
    this.rows = rows;
    this.cols = cols;
    this.cellSize = mapContainerSize;
    this.startCell = null;
    this.endCell = null;
    this.occupiedCells = new Set(); // track used positions as "r_c"
    this.buildings = []; // you could load this from localStorage
    this.buildingsCounter = 1; // for unique IDs

    this.initGrid();
    this.addListeners();

    window.addEventListener('resize', () => {
      this.cellSize = this.calculateCellSize(this.mapContainer);
      this.initGrid();
      this.loadStoredBuildings(); // re-render markers
    });
  }

  calculateCellSize(container) {
    const containerWidth = container.offsetWidth; // OR: container.getBoundingClientRect().width
    const size = (containerWidth / this.cols);
    return Math.max(30, Math.min(size, 100)); // Clamp for sanity
  } 

  initGrid() {
    this.mapElement.innerHTML = '';
    this.mapElement.style.display = 'grid';
    this.mapElement.style.gridTemplateColumns = `repeat(10 , 1fr)`;
    this.mapElement.style.gridTemplateRows = `repeat(10 , 1fr)`;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.textContent = `${r},${c}`;

        this.mapElement.appendChild(cell);
      }
    }
  }

  addListeners() {
    this.mapElement.addEventListener('click', (e) => {
      const cell = e.target.closest('.grid-cell');
      if (!cell) return;
      this.handleSelection(cell);
    });
  }

  handleSelection(cell) {
    if (!this.startCell) {
      this.clearSelection();
      this.startCell = cell;
      cell.classList.add('selected');
    } else {
      this.endCell = cell;
      this.highlightSelection();
    }
  }

  clearSelection() {
    this.mapElement.querySelectorAll('.grid-cell').forEach(cell => {
      cell.classList.remove('selected');
    });
    this.startCell = null;
    this.endCell = null;
  }

  highlightSelection() {
    const r1 = Math.min(+this.startCell.dataset.row, +this.endCell.dataset.row);
    const r2 = Math.max(+this.startCell.dataset.row, +this.endCell.dataset.row);
    const c1 = Math.min(+this.startCell.dataset.col, +this.endCell.dataset.col);
    const c2 = Math.max(+this.startCell.dataset.col, +this.endCell.dataset.col);

    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        const cell = this.mapElement.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
        if (cell) cell.classList.add('selected');
      }
    }
  }

  getSelectedArea() {
    if (!this.startCell || !this.endCell) return null;
    const startRow = Math.min(+this.startCell.dataset.row, +this.endCell.dataset.row);
    const endRow = Math.max(+this.startCell.dataset.row, +this.endCell.dataset.row);
    const startCol = Math.min(+this.startCell.dataset.col, +this.endCell.dataset.col);
    const endCol = Math.max(+this.startCell.dataset.col, +this.endCell.dataset.col);
    return {
      row: startRow,
      col: startCol,
      width: endCol - startCol + 1,
      height: endRow - startRow + 1
    };
  }

  placeBuilding(building) {
    const area = this.getSelectedArea();
    if (!area) return false;

    // Check collision
    for (let r = area.row; r < area.row + area.height; r++) {
      for (let c = area.col; c < area.col + area.width; c++) {
        if (this.occupiedCells.has(`${r}_${c}`)) {
          alert("That area is already occupied!");
          return false;
        }
      }
    }

    // Reserve cells
    for (let r = area.row; r < area.row + area.height; r++) {
      for (let c = area.col; c < area.col + area.width; c++) {
        this.occupiedCells.add(`${r}_${c}`);
      }
    }

    // Visually render it
    const marker = document.createElement('div');
    marker.classList.add('building-marker');
    marker.style.gridRowStart = area.row + 1;
    marker.style.gridRowEnd = `span ${area.height}`;
    marker.style.gridColumnStart = area.col + 1;
    marker.style.gridColumnEnd = `span ${area.width}`;
    marker.style.backgroundImage = `url(${building.image})`;
    marker.title = building.name;
    this.mapElement.appendChild(marker);

    const uniqueId = this.buildingsCounter;
    this.buildingsCounter += 1; // Increment for next building

    // Save it
    const stored = {
      id: uniqueId,
      name: building.name,
      image: building.image,
      type: building.type || "Unknown",
      level: 1,
      row: area.row,
      col: area.col,
      width: area.width,
      height: area.height,
      builtAt: new Date().toISOString()
    };
    this.buildings.push(stored);
    localStorage.setItem('infrastructure', JSON.stringify(this.buildings));

    this.clearSelection();
    return true;
  }

  loadStoredBuildings() {
    const data = JSON.parse(localStorage.getItem('infrastructure')) || [];
    this.buildings = data;

    data.forEach(b => {
      for (let r = b.row; r < b.row + b.height; r++) {
        for (let c = b.col; c < b.col + b.width; c++) {
          this.occupiedCells.add(`${r}_${c}`);
        }
      }

      const marker = document.createElement('div');
      marker.classList.add('building-marker');
      marker.style.gridRowStart = b.row + 1;
      marker.style.gridRowEnd = `span ${b.height}`;
      marker.style.gridColumnStart = b.col + 1;
      marker.style.gridColumnEnd = `span ${b.width}`;
      marker.style.backgroundImage = `url(${b.image})`;
      marker.title = b.name;
      this.mapElement.appendChild(marker);
    });
  }
}
