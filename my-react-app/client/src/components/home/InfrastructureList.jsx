import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../configuration/Firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";

import { useGameData } from "../../contexts/GameDataContext";

import ResetInfrastructureButton from "./ResetInfrastructureButton";
import InfrastructureItem from "./InfrastructureItem";
import BuildingFilter from "../BuildingFilter";

const InfrastructureList = () => {
  const [infrastructure, setInfrastructure] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState(["All"]);
  const [showMenu, setShowMenu] = useState(false);
  const { deductResources } = useGameData();

  // Fetch infrastructure from Firestore
  const loadInfrastructure = async () => {
    try {
      const response = await fetch("/api/builtBuildings");
      const infra = await response.json();
      setInfrastructure(infra);
    } catch (error) {
      console.error(
        "Error fetching infrastructure from Firestore:",
        error.message
      );
    }
  };

  useEffect(() => {
    loadInfrastructure();
  }, []);

  const navigate = useNavigate();

  const checkAuth = () => {
    if (!auth.currentUser) {
      navigate("/SignUp");
      return false;
    }
    return true;
  };

  const handleUpgrade = async (id) => {
    if (!checkAuth()) return;
    const infraCopy = [...infrastructure];
    const building = infraCopy.find((b) => b.id === id);

    if (!building) {
      console.error("Building not found!");
      return;
    }
    const currentLevel = building.level || 1;
    const nextLevel = currentLevel + 1;
    const nextLevelData = building.levels?.find((l) => l.level === nextLevel);

    if (!nextLevelData) return;

    const success = deductResources(nextLevelData.neededResources);
    if (!success) {
      alert("Not enough resources to upgrade!");
      return;
    }
    building.level = Number(nextLevel);
    setInfrastructure(infraCopy);

    try {
      const response = await fetch(
        `/api/builtBuildings/${building.id}/upgrade`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(building),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save building data");
      }
    } catch (error) {
      console.error("Error updating building in backend:", error.message);
    }
  };

  const filteredInfrastructure = selectedTypes.includes("All")
    ? infrastructure
    : infrastructure.filter((b) => selectedTypes.includes(b.type));

  return (
    <>
      <BuildingFilter
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />

      <div id="infrastructure-list">
        {filteredInfrastructure.map((infra) => {
          const currentUserId = auth.currentUser?.uid;
          const isOwner = infra.userId === currentUserId; // Check ownership here

          return (
            <InfrastructureItem
              key={infra.id}
              infra={infra}
              isOwner={isOwner} // Pass ownership status as a prop
              handleUpgrade={() => handleUpgrade(infra.id)}
            />
          );
        })}
        {/* <ResetInfrastructureButton onReset={loadInfrastructure} /> */}
      </div>
    </>
  );
};

export default InfrastructureList;
