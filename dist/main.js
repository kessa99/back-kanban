"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const firebaseAdmin = __importStar(require("firebase-admin"));
const fs = __importStar(require("fs"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['https://kanban-test-project.vercel.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    if (firebaseAdmin.apps.length === 0) {
        console.log('Initialize Firebase Application.');
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
        }
        else {
            try {
                const firebaseKeyFilePath = './kanban-5a370-firebase-adminsdk-fbsvc-b60c1950fd.json';
                const firebaseServiceAccount = JSON.parse(fs.readFileSync(firebaseKeyFilePath).toString());
                console.log('Using Firebase JSON file');
                firebaseAdmin.initializeApp({
                    credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
                });
            }
            catch (error) {
                console.error('Firebase initialization failed:', error.message);
                console.log('Continuing without Firebase initialization...');
            }
        }
    }
    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
    console.log(`Server is running on port http://0.0.0.0:${process.env.PORT ?? 3000}`);
}
bootstrap();
//# sourceMappingURL=main.js.map