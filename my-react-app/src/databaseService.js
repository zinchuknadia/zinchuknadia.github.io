import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "./configuration/Firebase";


export async function addUserToDatabase(user) {
  try {
      await setDoc(doc(db, "users", user.uid), {
          name: user.email.split('@')[0],
          email: user.email,
      });
      console.log("User added to database: ", user);
  } catch (error) {
      alert("Error adding user to database: ", error);
      console.error("Error adding user to database: ", error);
      throw error;
  }
}