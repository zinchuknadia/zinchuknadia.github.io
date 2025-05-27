import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { db, auth } from "../configuration/Firebase";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/PersonAccount.css";

function PersonAccount() {
  const { setUser } = useContext(UserContext);
  const [resources, setResources] = useState([]);
  const [buildings, setBuildings] = useState([]);

  // Fetch user's resources and buildings
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      try {
        // Fetch user's resources
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setResources(userDoc.data().resources || []);
        }

        // Fetch user's buildings
        const buildingsQuery = query(
          collection(db, "builtBuildings"),
          where("userId", "==", userId)
        );
        const buildingsSnapshot = await getDocs(buildingsQuery);
        const userBuildings = buildingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBuildings(userBuildings);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, []);

  function handleLogout() {
    auth
      .signOut()
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  }

  return (
    <>
      <Navbar />
      <div className="account-container">
        <div className="account-header">
          <h1>Account Overview</h1>
          <p>Welcome to your personal space.</p>
          <Link to="/" onClick={handleLogout} className="logout-button">
            Log Out
          </Link>
        </div>

        <div className="account-section">
          <h2>Your Resources</h2>
          <ul className="item-list">
            {resources.map((resource) => (
              <li key={resource.id}>
                {resource.name}: {resource.quantity}
              </li>
            ))}
          </ul>
        </div>

        <div className="account-section">
          <h2>Your Buildings</h2>
          <ul className="item-list">
            {buildings.map((building) => (
              <li key={building.id}>
                {building.name} (Level {building.level})
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PersonAccount;
