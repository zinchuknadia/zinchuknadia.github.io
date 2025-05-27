import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  use,
} from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../configuration/Firebase.js";
import { collection, getDocs } from "firebase/firestore";

import { useBuildStructure } from "./buildStructure.js";

const CityMap = forwardRef(({ id = "map", rows = 20, cols = 20 }, ref) => {
  const mapRef = useRef();
  const [startCell, setStartCell] = useState(null);
  const [endCell, setEndCell] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [occupiedCells, setOccupiedCells] = useState(new Set());

  const buildStructure = useBuildStructure();

  // const cellSize = 50;

  const [cellSize, setMapCell] = useState(50); // початкове значення

  useEffect(() => {
    const updateCellSize = () => {
      if (mapRef.current) {
        const { offsetWidth, offsetHeight } = mapRef.current;
        const cellWidth = offsetWidth / cols;
        const cellHeight = offsetHeight / rows;
        const newSize = Math.floor(Math.min(cellWidth, cellHeight));
        setMapCell(newSize);
      }
    };

    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, []);

  useImperativeHandle(ref, () => ({
    placeBuilding,
  }));

  useEffect(() => {
    const loadBuildings = async () => {
      try {
        const buildingsSnapshot = await getDocs(
          collection(db, "builtBuildings")
        );
        const buildingsData = buildingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBuildings(buildingsData);

        // Update occupied cells based on fetched buildings
        const occupied = new Set();
        buildingsData.forEach((b) => {
          for (let r = b.row; r < b.row + b.height; r++) {
            for (let c = b.col; c < b.col + b.width; c++) {
              occupied.add(`${r}_${c}`);
            }
          }
        });
        setOccupiedCells(occupied);
      } catch (error) {
        console.error("Error loading buildings from Firestore:", error.message);
      }
    };

    loadBuildings();
  }, []);

  useImperativeHandle(ref, () => ({
    placeBuilding,
  }));

  const handleCellClick = (r, c) => {
    const selected = { row: r, col: c };
    if (!startCell) setStartCell(selected);
    else if (!endCell) setEndCell(selected);
    else {
      setStartCell(selected);
      setEndCell(null);
    }
  };

  const getSelectedArea = () => {
    if (!startCell) return null;
    const end = endCell || startCell;
    const row = Math.min(startCell.row, end.row);
    const col = Math.min(startCell.col, end.col);
    const height = Math.abs(end.row - startCell.row) + 1;
    const width = Math.abs(end.col - startCell.col) + 1;
    return { row, col, width, height };
  };

  const placeBuilding = (building) => {
    const area = getSelectedArea();
    if (!area) {
      alert("No area selected!");
      return false;
    }

    for (let r = area.row; r < area.row + area.height; r++) {
      for (let c = area.col; c < area.col + area.width; c++) {
        if (occupiedCells.has(`${r}_${c}`)) {
          alert("That area is already occupied!");
          return false;
        }
      }
    }

    if (!buildStructure(building)) return false;

    const userId = auth.currentUser?.uid;
    if (!userId) {
      alert("User not authenticated!");
      return false;
    }

    const newBuilding = {
      id: Date.now(),
      buildingId: building.id,
      name: building.name,
      type: building.type || "Unknown",
      level: 1,
      levels: building.levels,
      row: area.row,
      col: area.col,
      width: area.width,
      height: area.height,
      builtAt: new Date().toISOString(),
      userId,
    };

    try {
      // Write the new building to Firestore
      const buildingDocRef = doc(db, "builtBuildings", `${newBuilding.id}`);
      setDoc(buildingDocRef, newBuilding);

      // Update local state with the new building
      setBuildings((prevBuildings) => [...prevBuildings, newBuilding]);

      // Update occupied cells
      const newOccupied = new Set(occupiedCells);
      for (let r = area.row; r < area.row + area.height; r++) {
        for (let c = area.col; c < area.col + area.width; c++) {
          newOccupied.add(`${r}_${c}`);
        }
      }
      setOccupiedCells(newOccupied);
      setStartCell(null);
      setEndCell(null);

      return true;
    } catch (error) {
      console.error("Error saving building to Firestore:", error.message);
      alert("Failed to save building. Please try again.");
      return false;
    }
  };

  return (
    <div
      ref={mapRef}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        position: "relative",
      }}
      id={id}
      className="map"
    >
      {[...Array(rows * cols)].map((_, idx) => {
        const r = Math.floor(idx / cols);
        const c = idx % cols;
        const isSelected =
          startCell &&
          ((!endCell && startCell.row === r && startCell.col === c) ||
            (endCell &&
              r >= Math.min(startCell.row, endCell.row) &&
              r <= Math.max(startCell.row, endCell.row) &&
              c >= Math.min(startCell.col, endCell.col) &&
              c <= Math.max(startCell.col, endCell.col)));

        return (
          <div
            key={`${r}_${c}`}
            className={`grid-cell ${isSelected ? "selected" : ""}`}
            onClick={() => handleCellClick(r, c)}
            data-row={r}
            data-col={c}
          />
        );
      })}

      {buildings.map((b) => (
        <div
          key={b.id}
          className="building-marker"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/${
              b.levels[b.level - 1].outlineImage
            })`,
            width: `${b.width * cellSize}px`,
            height: `${b.height * cellSize}px`,
            left: `${b.col * cellSize}px`,
            top: `${b.row * cellSize}px`,
            position: "absolute",
          }}
          title={b.name}
        />
      ))}
    </div>
  );
});

export default CityMap;
