import React, { createContext, useContext, useEffect, useState } from "react";

const GameDataContext = createContext();

export const GameDataProvider = ({ children }) => {
  const [resources, setResources] = useState([]);
  const [budget, setBudget] = useState(0);

  // Завантаження з localStorage
  useEffect(() => {
    const storedResources = JSON.parse(localStorage.getItem("resources"));
    const storedBudget = JSON.parse(localStorage.getItem("budget"));

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
      storedBudget =
        storedResources.find((r) => r.name === "Budget")?.quantity || 0;
      setBudget(storedBudget);
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
      value={{ resources, budget, setBudget, updateResource, deductResources }}
    >
      {children}
    </GameDataContext.Provider>
  );
};

export const useGameData = () => useContext(GameDataContext);
