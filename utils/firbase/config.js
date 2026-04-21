import admin from "firebase-admin";

const firebaseConfig = JSON.parse(process.env.FIREBASE_JSON);
firebaseConfig.private_key = firebaseConfig.private_key.replace(/\\n/g, "\n");
if (!admin.apps.length) {
  // console.log("firebaseConfig", firebaseConfig);
  // console.log("firebaseConfig.private_key", firebaseConfig.private_key);
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });
}

export default admin;
