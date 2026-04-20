import admin from 'firebase-admin';
import serviceAccount from '../../kickchain-app-firebase-adminsdk-fbsvc-9baaa2aa88.json' with { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;