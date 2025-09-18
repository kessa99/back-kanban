import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as firebaseAdmin from 'firebase-admin';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:8081', 'http://localhost:5173', 'http://127.0.0.1:8081', 'http://127.0.0.1:5173', 'https://kanban-test-project.vercel.app/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  //firebase ;
  const firebaseKeyFilePath =
    './kanban-5a370-firebase-adminsdk-fbsvc-b60c1950fd.json';
  const firebaseServiceAccount /*: ServiceAccount*/ = JSON.parse(
    fs.readFileSync(firebaseKeyFilePath).toString(),
  );
  if (firebaseAdmin.apps.length === 0) {
    console.log('Initialize Firebase Application.');
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
    });
  }

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`Server is running on port http://0.0.0.0:${process.env.PORT ?? 3000}`);
}
bootstrap();
