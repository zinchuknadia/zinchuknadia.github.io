import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db, auth } from "../configuration/Firebase";

// Initialize user resources in Firestore
export async function initializeUserResources() {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    // Fetch resource metadata
    const resourcesSnapshot = await getDocs(collection(db, "resources"));
    const resourceTemplates = resourcesSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));

    // Initialize user resources array
    const userResources = resourceTemplates.map((res) => ({
      id: res.id,
      name: res.name,
      quantity: 100, // Default quantity
    }));

    const userDocRef = doc(db, `users/${userId}`);
    await setDoc(userDocRef, { resources: userResources }, { merge: true });
    console.log("User resources initialized successfully");
  } catch (error) {
    console.error("Error initializing user resources:", error.code, error.message);
    throw error;
  }
}
