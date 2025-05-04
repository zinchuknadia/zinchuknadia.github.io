export default class CityMap {
  constructor(mapElementId, rows, cols) {
    this.mapElementId = mapElementId;
    this.rows = rows;
    this.cols = cols;
    this.startCell = null;
    this.endCell = null;
    this.occupiedCells = new Set(); // track used positions as "r_c"
    this.buildings = []; // you could load this from localStorage
    this.buildingsCounter = 1; // for unique IDs
  }

  initGrid() {
    this.mapElement = document.getElementById(this.mapElementId);

    this.mapElement.innerHTML = '';
    this.mapElement.style.display = 'grid';
    this.mapElement.style.gridTemplateColumns = `repeat(${this.cols} , 1fr)`;
    this.mapElement.style.gridTemplateRows = `repeat(${this.rows} , 1fr)`;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        // cell.textContent = `${r},${c}`;

        this.mapElement.appendChild(cell);
      }
    }

    this.cellSize = this.mapElement.querySelector('.grid-cell')?.offsetWidth || 50;
    this.loadStoredBuildings();
    this.addListeners();
  }

  addListeners() {
    this.mapElement.addEventListener('click', (e) => {
      const cell = e.target.closest('.grid-cell');
      if (!cell) return;
      this.handleSelection(cell);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.clearSelection();
      }
    });
    
    // window.addEventListener('resize', () => {
    //   this.cellSize = this.mapElement.querySelector('.grid-cell')?.offsetWidth || 50;
    //   this.initGrid(); // Reinitialize the grid to adjust to new size
    //   this.loadStoredBuildings(); // Re-render markers
    // });
  }

  handleSelection(cell) {
    const row = +cell.dataset.row;
    const col = +cell.dataset.col;
  
    // If it's already selected as start
    if (this.startCell && this.startCell.dataset.row == row && this.startCell.dataset.col == col) {
      if (this.endCell) {
        // Promote endCell to startCell
        this.startCell = this.endCell;
        this.endCell = null;
      } else {
        // Only one selected — just clear
        this.clearSelection();
      }
      this.highlightSelection(); // Refresh visuals
      return;
    }
  
    // If it's already selected as end
    if (this.endCell && this.endCell.dataset.row == row && this.endCell.dataset.col == col) {
      this.endCell = null;
      this.highlightSelection();
      return;
    }
  
    // No selection yet → make it the start
    if (!this.startCell) {
      this.startCell = cell;
    } else if (!this.endCell) {
      // Select second cell
      this.endCell = cell;
    } else {
      // Both selected already → start new selection
      this.startCell = cell;
      this.endCell = null;
    }
  
    this.highlightSelection();
  }
  

  clearSelection() {
    this.mapElement.querySelectorAll('.grid-cell.selected').forEach(cell => {
      cell.classList.remove('selected');
    });
    this.startCell = null;
    this.endCell = null;
  }
  

  highlightSelection() {
    // Clear previous highlights
    this.mapElement.querySelectorAll('.grid-cell.selected').forEach(cell => {
      cell.classList.remove('selected');
    });
  
    if (!this.startCell && !this.endCell) return;
  
    // If only startCell is selected
    if (this.startCell && !this.endCell) {
      this.startCell.classList.add('selected');
      return;
    }
  
    // If both are selected, highlight range
    const startRow = +this.startCell.dataset.row;
    const startCol = +this.startCell.dataset.col;
    const endRow = +this.endCell.dataset.row;
    const endCol = +this.endCell.dataset.col;
  
    const r1 = Math.min(startRow, endRow);
    const r2 = Math.max(startRow, endRow);
    const c1 = Math.min(startCol, endCol);
    const c2 = Math.max(startCol, endCol);
  
    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        const cellKey = `${r}_${c}`;
        const cell = this.mapElement.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
        if (cell && !this.occupiedCells.has(cellKey)) {
          cell.classList.add('selected');
        }
      }
    }
  }
   
  
  getSelectedArea() {
    if (!this.startCell && !this.endCell) return null;
  
    // If only one cell is selected
    if (this.startCell && !this.endCell) {
      const row = +this.startCell.dataset.row;
      const col = +this.startCell.dataset.col;
      return {
        row,
        col,
        width: 1,
        height: 1
      };
    }
  
    // Otherwise, full rectangular area
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
    if (!area) {
      alert("Building cannot be placed here!");
      return false;
    }

    // Check collision
    for (let r = area.row; r < area.row + area.height; r++) {
      for (let c = area.col; c < area.col + area.width; c++) {
        if (this.occupiedCells.has(`${r}_${c}`)) {
          alert("That area is already occupied!");
          return false;
        }
      }
    }

    const enoughResources = buildStructure(building);
    if (!enoughResources) return false;

    // Reserve cells
    for (let r = area.row; r < area.row + area.height; r++) {
      for (let c = area.col; c < area.col + area.width; c++) {
        this.occupiedCells.add(`${r}_${c}`);
      }
    }

   // Visually render it with absolute positioning
    const marker = document.createElement('div');
    marker.classList.add('building-marker');
    marker.style.backgroundImage = `url(${building.levels[building.level].outlineImage})`;
    marker.title = building.name;

    marker.style.width = `${area.width * this.cellSize}px`;
    marker.style.height = `${area.height * this.cellSize}px`;
    marker.style.left = `${area.col * this.cellSize}px`;
    marker.style.top = `${area.row * this.cellSize}px`;

    this.mapElement.appendChild(marker);


    const uniqueId = this.buildingsCounter;
    this.buildingsCounter += 1; // Increment for next building

    // Save it
    const stored = {
      id: uniqueId,
      name: building.name,
      image: building.image,
      type: building.type || "Unknown",
      level: building.level || 1,
      levels: building.levels || [],
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
      // Reserve occupied cells
      for (let r = b.row; r < b.row + b.height; r++) {
        for (let c = b.col; c < b.col + b.width; c++) {
          this.occupiedCells.add(`${r}_${c}`);
        }
      }
  
      // Create marker with absolute positioning
      const marker = document.createElement('div');
      marker.classList.add('building-marker');
      marker.style.backgroundImage = `url(${b.levels[b.level - 1].outlineImage})`;
      marker.title = b.name;
  
      marker.style.width = `${b.width * this.cellSize}px`;
      marker.style.height = `${b.height * this.cellSize}px`;
      marker.style.left = `${b.col * this.cellSize}px`;
      marker.style.top = `${b.row * this.cellSize}px`;
      marker.style.position = 'absolute'; // make sure this is set!
  
      this.mapElement.appendChild(marker);
    });
  }
}
