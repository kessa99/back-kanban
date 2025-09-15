/**
 * @description Firebase configuration
 */
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

// Firebase configuration from environment variables
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://kanban-5a370.firebaseio.com',
  });
}

export const firestore = admin.firestore();
export const auth = admin.auth();
export default admin;
