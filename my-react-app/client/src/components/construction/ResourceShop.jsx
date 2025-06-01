import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../configuration/Firebase";

import { useGameData } from "../../contexts/GameDataContext";
// import ResetResourcesButton from "./ResetResourcesButton";
import ShopResource from "./ShopResource";
import BudgetManager from "./ShopBudget";
import { initializeUserResources } from "../../uploadData/uploadUserResources";

const ResourceShop = () => {
  const { resources, budget, updateResource } = useGameData();
  const [inputAmount, setInputAmount] = useState(1);

  const navigate = useNavigate();

  const checkAuth = () => {
    if (!auth.currentUser) {
      navigate("/SignUp");
      return false;
    }
    return true;
  };

  const handleInitializeResources = async () => {
    if (!checkAuth()) return;
    try {
      await initializeUserResources();
      alert("Resources initialized successfully");
    } catch (error) {
      console.error("Error initializing resources:", error);
      alert("Failed to initialize resources");
    }
  };

  const handleBuy = async (resourceId, price) => {
    if (!checkAuth()) return;
    const budgetRes = resources.find((r) => r.name === "Gold"); // Gold
    const targetRes = resources.find((r) => r.id === resourceId && r.name !== "Gold");

    if (!budgetRes || !targetRes) {
      alert("Resource not found");
      return;
    }

    if (budgetRes.quantity >= price) {
      try {
        await updateResource(1, -price); // Deduct Gold
        await updateResource(resourceId, 1); // Add resource
      } catch (error) {
        console.error("Error buying resource:", error);
        alert("Failed to buy resource");
      }
    } else {
      alert("Not enough Gold to buy this resource.");
    }
  };

  const updateBudget = async (action) => {
    if (!checkAuth()) return;
    try {
      if (action === "add") {
        await updateResource(1, inputAmount);
      } else if (action === "subtract") {
        if (budget >= inputAmount) {
          await updateResource(1, -inputAmount);
        } else {
          alert("Not enough Gold to subtract this amount.");
          return;
        }
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      alert("Failed to update budget");
    }
  };

  return (
    <>
      <BudgetManager
        budgetResource={resources.find((r) => r.name === "Gold")} // Gold as Budget
        inputAmount={inputAmount}
        setInputAmount={setInputAmount}
        updateBudget={updateBudget}
      />

      <section className="resources-manager">
        <h2>Resources</h2>
        <div className="resource-section">
          <div id="construction-resource-list">
            {resources
              .filter((r) => r.name !== "Gold")
              .map((resource) => (
                <ShopResource
                  key={resource.id}
                  resource={resource}
                  onBuy={() => handleBuy(resource.id, resource.price)}
                />
              ))}
            {/* <ResetResourcesButton onReset={handleInitializeResources} /> */}
            <button className="upload-button" onClick={handleInitializeResources}>
              Initialize Resources
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResourceShop;
