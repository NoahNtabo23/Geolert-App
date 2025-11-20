// config.js
const admin = require("firebase-admin");

// Load service account from ENV variable (Render)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const Disaster = db.collection("Disasters");
const Partner = db.collection("Partners");

module.exports = { Disaster, Partner };
