"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.firestore = void 0;
const admin = require("firebase-admin");
const serviceAccount = {
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
exports.firestore = admin.firestore();
exports.auth = admin.auth();
exports.default = admin;
//# sourceMappingURL=firebase.config.js.map