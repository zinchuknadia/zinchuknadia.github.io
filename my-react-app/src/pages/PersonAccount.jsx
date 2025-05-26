import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { auth } from "../configuration/Firebase";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/PersonAccount.css"; 

function PersonAccount() {
  const { setUser } = useContext(UserContext);
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
            <li>Wood: 120</li>
            <li>Stone: 85</li>
            <li>Gold: 50</li>
          </ul>
        </div>

        <div className="account-section">
          <h2>Your Buildings</h2>
          <ul className="item-list">
            <li>Farm (Level 2)</li>
            <li>Blacksmith (Level 1)</li>
            <li>Warehouse (Level 3)</li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PersonAccount;
