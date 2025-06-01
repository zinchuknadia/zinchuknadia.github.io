import React from "react";
import { auth } from "../configuration/Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addUserToDatabase } from "../databaseService";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import "../styles/LoginSignup.css"; 

function LogIn() {
  const navigate = useNavigate();

  async function login() {
    const email = document.getElementById("emailLogin").value;
    const password = document.getElementById("passwordLogin").value;
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      alert(
        "Welcome back, " +
          userCredential.user.displayName +
          "! You have successfully logged in."
      );

      const uid = userCredential.user.uid;
      navigate(`/user/${uid}`);
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        alert("Wrong password. Please try again.");
      }
      alert("Sorry, something went wrong. Please try again later.");
      console.log("Error: " + error.message);
    }
  }
  
  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div id="login" className="form-box">
          <h2>Login</h2>
          <p>Log in to your account</p>
          <input type="email" id="emailLogin" placeholder="Email" />
          <input type="password" id="passwordLogin" placeholder="Password" />
          <button onClick={login}>Login</button>
          <p className="switch-link">
            No account? <a href="#signup">SignUp</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default LogIn;

