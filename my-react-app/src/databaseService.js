import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "./configuration/Firebase";
import { getDocs, collection } from "firebase/firestore";


export async function addUserToDatabase(user) {
  try {
    // Fetch resource templates from Firestore
    const resourcesSnapshot = await getDocs(collection(db, "resources"));
    const resourceTemplates = resourcesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Initialize user resources
    const userResources = resourceTemplates.map((resource) => ({
      id: resource.id,
      name: resource.name,
      quantity: resource.quantity || 100, // Default quantity if not specified
    }));

    // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
          name: user.email.split('@')[0],
          email: user.email,
          resources: userResources,
          createdAt: new Date().toISOString(),
      });
      console.log("User added to database: ", user);
  } catch (error) {
      alert("Error adding user to database: ", error);
      console.error("Error adding user to database: ", error);
      throw error;
  }
}