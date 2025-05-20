import React, { useState } from "react";
import { useGameData } from "../../contexts/GameDataContext"; 
import ResetResourcesButton from "./ResetResourcesButton";
import ShopResource from "./ShopResource"; 
import BudgetManager from "./ShopBudget"; 

const ResourceShop = () => {
  const { resources, setResources } = useGameData();
  const [inputAmount, setInputAmount] = useState(1);

  const budgetRes = resources.find((r) => r.name === "Budget");
  // const budget = budgetRes?.quantity || 0;

  // Reload default data from JSON
  const loadResourcesFromJSON = async () => {
    const response = await fetch(
      `${process.env.PUBLIC_URL}/data/resources.json`
    );
    const data = await response.json();
    localStorage.setItem("resources", JSON.stringify(data));
    setResources(data);
  };

  const handleBuy = (resourceId, price) => {
    const updated = [...resources];
    const budgetRes = updated.find((r) => r.name === "Budget");
    const targetRes = updated.find((r) => r.id === resourceId);

    if (budgetRes.quantity >= price) {
      budgetRes.quantity -= price;
      targetRes.quantity += 1;
      setResources(updated);
    } else {
      alert("Not enough budget to buy this resource.");
    }
  };

  const updateBudget = (action) => {
    const updated = [...resources];
    const budgetRes = updated.find((r) => r.name === "Budget");

    if (action === "add") {
      budgetRes.quantity += inputAmount;
    } else if (action === "subtract") {
      if (budgetRes.quantity >= inputAmount) {
        budgetRes.quantity -= inputAmount;
      } else {
        alert("Not enough budget to subtract this amount.");
        return;
      }
    }

    setResources(updated);
  };

  return (
    <>
      <BudgetManager
        budgetResource={budgetRes}
        inputAmount={inputAmount}
        setInputAmount={setInputAmount}
        updateBudget={updateBudget}
      />

      <section className="resources-manager">
        <h2>Resources</h2>
        <div className="resource-section">
          <div id="construction-resource-list">
            {resources
              .filter((r) => r.name !== "Budget")
              .map((resource) => (
                <ShopResource
                  key={resource.id}
                  resource={resource}
                  onBuy={handleBuy}
                />
              ))}
            <ResetResourcesButton onReset={loadResourcesFromJSON} />
          </div>
        </div>
      </section>
    </>
  );
};

export default ResourceShop;
