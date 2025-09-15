/**
 * @description Firebase configuration
 */
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { join } from 'path';
import { readFileSync } from 'fs';

const serviceAccount: ServiceAccount = JSON.parse(
  readFileSync(
    join(process.cwd(), 'src/config/firebase/kanban-5a370-firebase-adminsdk-fbsvc-b60c1950fd.json'),
    'utf8',
  ),
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://kanban-5a370.firebaseio.com',
  });
}

export const firestore = admin.firestore();
export const auth = admin.auth();
export default admin;
