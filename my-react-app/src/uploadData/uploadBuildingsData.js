import { db } from '../configuration/Firebase'; // Adjust this path to your firebase config
import { setDoc, doc } from 'firebase/firestore';

export async function uploadBuildingsData() {
  try {
    const response = await fetch(`${process.env.PUBLIC_URL}/data/buildings-avaliable.json`);
    const buildings = await response.json();

    for (const building of buildings) {
      await setDoc(doc(db, "buildingTemplates", building.id.toString()), building);
      console.log(`✅ Uploaded building: ${building.name}`);
    }
  } catch (error) {
    console.error("❌ Error uploading buildings:", error);
  }
}

