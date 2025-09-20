import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as firebaseAdmin from 'firebase-admin';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: ['https://kanban-test-project.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });


  
  // Firebase initialization using environment variables
  if (firebaseAdmin.apps.length === 0) {
    console.log('Initialize Firebase Application.');
    
    // Check if we have Firebase environment variables
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      console.log('Using Firebase environment variables');
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
    } else {
      // Fallback to JSON file if environment variables are not available
      try {
        const firebaseKeyFilePath = './kanban-5a370-firebase-adminsdk-fbsvc-b60c1950fd.json';
        const firebaseServiceAccount = JSON.parse(
          fs.readFileSync(firebaseKeyFilePath).toString(),
        );
        console.log('Using Firebase JSON file');
        firebaseAdmin.initializeApp({
          credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
        });
      } catch (error) {
        console.error('Firebase initialization failed:', error.message);
        console.log('Continuing without Firebase initialization...');
      }
    }
  }

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`Server is running on port http://0.0.0.0:${process.env.PORT ?? 3000}`);
}
bootstrap();
