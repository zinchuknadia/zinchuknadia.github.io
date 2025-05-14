import React, { useState } from "react";
import { useGameData } from "../../contexts/GameDataContext"; // оновити шлях при потребі
import ResetResourcesButton from "../ResetResourcesButton";

const ResourceShop = () => {
  const { resources, setResources } = useGameData();
  const [inputAmount, setInputAmount] = useState(1);

  const budgetRes = resources.find((r) => r.name === "Budget");
  const budget = budgetRes?.quantity || 0;

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
      <section className="budget-manager">
        <h2>Budget</h2>
        <div id="budget">
          <img
            src={`${process.env.PUBLIC_URL}/${
              resources.find((r) => r.name === "Budget")?.image || ""
            }`}
            alt="Budget"
          />
          <div className="budget-description">
            <p id="budget-amount-display">${budget}</p>
            <div className="budget-control">
              <input
                type="number"
                value={inputAmount}
                onChange={(e) => setInputAmount(parseInt(e.target.value) || 1)}
              />
              <div className="budget-control-buttons">
                <button onClick={() => updateBudget("subtract")}>-</button>
                <button onClick={() => updateBudget("add")}>+</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="resources-manager">
        <h2>Resources</h2>
        <div className="resource-section">
          <div id="construction-resource-list">
            {resources
              .filter((r) => r.name !== "Budget")
              .map((resource) => (
                <div key={resource.id} className="resource">
                  <img
                    src={`${process.env.PUBLIC_URL}/${resource.image}`}
                    alt={resource.name}
                  />
                  <div className="resource-info">
                    <h4>
                      {resource.name} {resource.emoji}
                    </h4>
                    <p>${resource.price}</p>
                    <p className="amount">x{resource.quantity}</p>
                    <button
                      onClick={() => handleBuy(resource.id, resource.price)}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            <ResetResourcesButton onReset={loadResourcesFromJSON} />
          </div>
        </div>
      </section>
    </>
  );
};

export default ResourceShop;
