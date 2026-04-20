import admin from "firebase-admin";

console.log(process.env.FIREBASE_JSON);
const firebaseConfig = JSON.parse(process.env.FIREBASE_JSON);
if (!admin.apps.length) {
  console.log("firebaseConfig", firebaseConfig);
  console.log("firebaseConfig.private_key", firebaseConfig.private_key);
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });
}

export default admin;
