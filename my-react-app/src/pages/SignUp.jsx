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

function SignUp() {
  const navigate = useNavigate();

  async function signUp() {
    const email = document.getElementById("emailSignup").value;
    const password = document.getElementById("passwordSignup").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await addUserToDatabase(user);

      alert("Welcome!You have successfully signed up.");
      const uid = userCredential.user.uid;
      navigate(`/user/${uid}`);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Email already in use. Please use a different email.");
      }
      alert("Sorry, something went wrong. Please try again later.");
      console.log("Error: " + error.message);
    }
  }

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div id="signup" className="form-box">
          <h2>Sign Up</h2>
          <p>Create a new account</p>
          <input type="email" id="emailSignup" placeholder="Email" />
          <input type="password" id="passwordSignup" placeholder="Password" />
          <button onClick={signUp}>Sign Up</button>
          <p className="switch-link">
            Already have an account? <a href="#login">Login</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default SignUp;
