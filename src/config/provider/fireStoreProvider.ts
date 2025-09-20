// src/config/provider/fireStoreProvider.ts
import * as admin from 'firebase-admin';

export const FireStoreProvider = {
  provide: admin.firestore.Firestore,
  useFactory: () => admin.firestore(),
};
