import React from "react";

const BudgetManager = ({ budgetResource, inputAmount, setInputAmount, updateBudget }) => {
  if (!budgetResource) return null;

  const { image, quantity, name } = budgetResource;

  return (
    <section className="budget-manager">
      <h2>{name}</h2>
      <div id="budget">
        <img src={`${process.env.PUBLIC_URL}/${image}`} alt={name} />
        <div className="budget-description">
          <p id="budget-amount-display">${quantity}</p>
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
  );
};

export default BudgetManager;
