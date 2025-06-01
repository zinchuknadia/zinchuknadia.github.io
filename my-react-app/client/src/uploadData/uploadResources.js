import { db } from '../configuration/Firebase'; // Adjust this path to your firebase config
import { setDoc, doc } from 'firebase/firestore';

export async function uploadResourcesData() {
  try {
    const response = await fetch(`${process.env.PUBLIC_URL}/data/resources.json`);
    const resources = await response.json();

    for (const resource of resources) {
      await setDoc(doc(db, "resources", resource.id.toString()), resource);
      console.log(`✅ Uploaded resource: ${resource.name}`);
    }
  } catch (error) {
    console.error("❌ Error uploading resources:", error);
  }
}

