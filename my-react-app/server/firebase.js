// server/firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://cityconstruction-b51b5.firebaseio.com" // заміни на свій
});

const db = admin.firestore();
module.exports ={ db };
