import React, { createContext, useContext, useEffect, useState } from "react";

const GameDataContext = createContext();

export const GameDataProvider = ({ children }) => {
  const [resources, setResources] = useState(() => {
    return JSON.parse(localStorage.getItem("resources")) || [];
  });
  const [budget, setBudget] = useState(() => {
    const storedBudget = localStorage.getItem("budget");
    return storedBudget ? JSON.parse(storedBudget) : null;
  });

  // Завантаження з localStorage
  useEffect(() => {
    const storedResourcesRaw = localStorage.getItem("resources");
    const storedBudgetRaw = localStorage.getItem("budget");
  
    let storedResources = [];
    let storedBudget = null;
  
    try {
      if (storedResourcesRaw) storedResources = JSON.parse(storedResourcesRaw);
    } catch (e) {
      console.warn("Invalid JSON in 'resources' key:", storedResourcesRaw);
    }
  
    try {
      if (storedBudgetRaw) storedBudget = JSON.parse(storedBudgetRaw);
    } catch (e) {
      console.warn("Invalid JSON in 'budget' key:", storedBudgetRaw);
    }
  
    if (storedResources && storedResources.length > 0) {
      setResources(storedResources);
    } else {
      fetch(`${process.env.PUBLIC_URL}/data/resources.json`)
        .then((res) => {
          if (!res.ok) throw new Error("Resource fetch error");
          return res.json();
        })
        .then((data) => setResources(data))
        .catch((err) =>
          console.error("Failed to load resources from JSON:", err)
        );
    }
  
    if (storedBudget !== null) {
      setBudget(storedBudget);
    } else {
      const budgetResource = storedResources.find((r) => r.name === "Budget");
      setBudget(budgetResource?.quantity || 0);
    }
  }, []);
  

  // Синхронізація з localStorage
  useEffect(() => {
    localStorage.setItem("resources", JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem("budget", JSON.stringify(budget));
  }, [budget]);

  const updateResource = (id, amountChange) => {
    setResources((prev) =>
      prev.map((res) =>
        res.id === id ? { ...res, quantity: res.quantity + amountChange } : res
      )
    );
  };

  const deductResources = (needed) => {
    const canBuild = needed.every((req) => {
      const res = resources.find((r) => r.id === req.id);
      return res && res.quantity >= req.amount;
    });

    if (!canBuild) return false;

    setResources((prev) =>
      prev.map((res) => {
        const req = needed.find((r) => r.id === res.id);
        if (req) {
          return { ...res, quantity: res.quantity - req.amount };
        }
        return res;
      })
    );

    return true;
  };

  return (
    <GameDataContext.Provider
      value={{ resources, setResources, budget, setBudget, updateResource, deductResources }}
    >
      {children}
    </GameDataContext.Provider>
  );
};

export const useGameData = () => useContext(GameDataContext);
