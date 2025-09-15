/**
 * Firebase Module - Firebase Services Configuration
 * 
 * This module provides Firebase services to the entire application.
 * It configures Firebase Admin SDK and exports the following services:
 * - FIREBASE_ADMIN: The main Firebase Admin instance
 * - FIRESTORE: Firestore database instance for data operations
 * - FIREBASE_AUTH: Firebase Authentication service
 * 
 * This module is marked as @Global() so it can be used across all modules
 * without needing to import it in each module.
 */

import { Global, Module } from '@nestjs/common';
import admin from 'src/config/firebase/firebase.config';

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useValue: admin,
    },
    {
      provide: 'FIRESTORE',
      useValue: admin.firestore(),
    },
    {
      provide: 'FIREBASE_AUTH',
      useValue: admin.auth(),
    },
  ],
  exports: ['FIREBASE_ADMIN', 'FIRESTORE', 'FIREBASE_AUTH'],
})
export class FirebaseModule {}