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
      const builtBuildingsSnapshot = await getDocs(
        collection(db, "builtBuildings")
      );
      const infra = builtBuildingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

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
    console.log("handleUpgrade called with id:", id);
    const infraCopy = [...infrastructure];
    const building = infraCopy.find((b) => b.id === id);

    if (!building) {
      console.error("Building not found!");
      return;
    }

    // Check if the current user is the owner of the building
    const currentUserId = auth.currentUser?.uid;
    if (building.userId !== currentUserId) {
      alert("This is not your building to improve!");
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
    // building.image = nextLevelData.image;

    setInfrastructure(infraCopy);

    // Update Firestore with the upgraded building
    try {
      console.log("Building to update:", building);
      const buildingDocRef = doc(db, "builtBuildings", building.id);
      setDoc(buildingDocRef, building, { merge: true });
    } catch (error) {
      console.error("Error updating building in Firestore:", error.message);
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
        {filteredInfrastructure.map((infra) => (
          <InfrastructureItem
            key={infra.id}
            infra={infra}
            handleUpgrade={() => handleUpgrade(infra.id)}
          />
        ))}
        <ResetInfrastructureButton onReset={loadInfrastructure} />
      </div>
    </>
  );
};

export default InfrastructureList;
