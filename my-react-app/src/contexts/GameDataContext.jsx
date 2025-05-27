import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db, auth } from "../configuration/Firebase";

const GameDataContext = createContext();

export const GameDataProvider = ({ children }) => {
  const [resources, setResources] = useState([]);
  const [userId, setUserId] = useState(null);

  // Fetch resources from Firestore when user is authenticated
  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Fetch resource metadata from resources collection
        const resourcesSnapshot = await getDocs(collection(db, "resources"));
        const resourceTemplates = resourcesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Resource templates:", resourceTemplates);

        // Set default resources if no user is authenticated
        if (!auth.currentUser) {
          setResources(resourceTemplates.map((res) => ({ ...res, quantity: 100 }))); // Default quantity
          return;
        }

        // Fetch user-specific quantities
        setUserId(auth.currentUser.uid);
        const userDocRef = doc(db, `users/${auth.currentUser.uid}`);
        const userDoc = await getDoc(userDocRef);
        let userResources = [];
        if (userDoc.exists() && userDoc.data().resources) {
          userResources = userDoc.data().resources;
          console.log("User resources array:", userResources);
        }

        // Merge templates with user quantities
        const mergedResources = resourceTemplates.map((template) => ({
          ...template,
          quantity: userResources.find((r) => r.id === template.id)?.quantity ?? 100, // Default quantity
        }));
        console.log("Merged resources:", mergedResources);
        setResources(mergedResources);
      } catch (error) {
        console.error("Firestore fetch error:", error.code, error.message);
        setResources([]);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      fetchResources();
    });

    fetchResources(); // Initial fetch for unauthenticated state
    return () => unsubscribe();
  }, []);

  // Update a single resource in Firestore and context
  const updateResource = async (id, amountChange) => {
    if (!userId) {
      console.warn("User not authenticated, updating local resources");
      setResources((prev) =>
        prev.map((res) =>
          res.id === id ? { ...res, quantity: res.quantity + amountChange } : res
        )
      );
      return;
    }

    try {
      const userDocRef = doc(db, `users/${userId}`);
      const userDoc = await getDoc(userDocRef);
      let userResources = [];
      if (userDoc.exists() && userDoc.data().resources) {
        userResources = userDoc.data().resources;
      }

      const updatedResources = userResources.map((res) =>
        res.id === id ? { ...res, quantity: res.quantity + amountChange } : res
      );
      if (!updatedResources.find((r) => r.id === id)) {
        updatedResources.push({ id, name: resources.find((r) => r.id === id)?.name || "Unknown", quantity: amountChange });
      }

      await setDoc(userDocRef, { resources: updatedResources }, { merge: true });

      setResources((prev) =>
        prev.map((res) =>
          res.id === id ? { ...res, quantity: res.quantity + amountChange } : res
        )
      );
    } catch (error) {
      console.error("Error updating resource:", error.code, error.message);
    }
  };

  // Deduct multiple resources for building
  const deductResources = async (needed) => {
    if (!userId) {
      console.warn("User not authenticated, checking local resources");
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
    }

    try {
      const userDocRef = doc(db, `users/${userId}`);
      const userDoc = await getDoc(userDocRef);
      let userResources = [];
      if (userDoc.exists() && userDoc.data().resources) {
        userResources = userDoc.data().resources;
      }

      const canBuild = needed.every((req) => {
        const res = userResources.find((r) => r.id === req.id);
        return res && res.quantity >= req.amount;
      });

      if (!canBuild) return false;

      const updatedResources = userResources.map((res) => {
        const req = needed.find((r) => r.id === res.id);
        if (req) {
          return { ...res, quantity: res.quantity - req.amount };
        }
        return res;
      });

      await setDoc(userDocRef, { resources: updatedResources }, { merge: true });

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
    } catch (error) {
      console.error("Error deducting resources:", error.code, error.message);
      return false;
    }
  };

  // Budget from Gold resource
  const budget = resources.find((r) => r.name === "Gold")?.quantity || 0;

  return (
    <GameDataContext.Provider
      value={{ resources, setResources, budget, updateResource, deductResources }}
    >
      {children}
    </GameDataContext.Provider>
  );
};

export const useGameData = () => useContext(GameDataContext);
