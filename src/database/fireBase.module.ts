// src/firebase/firebase.module.ts
import { Global, Module } from '@nestjs/common';
import admin from '../config/firebase/firebase.config';

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
