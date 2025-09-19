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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseUserRepository = void 0;
const userTeam_user_entity_1 = require("../../domain/entities/userTeam/userTeam.user.entity");
const common_1 = require("@nestjs/common");
const firebase_admin_1 = require("firebase-admin");
const bcrypt = __importStar(require("bcryptjs"));
let FirebaseUserRepository = class FirebaseUserRepository {
    constructor(firestore) {
        this.firestore = firestore;
        this.userCollection = this.firestore.collection("users");
    }
    async updateFcmToken(userId, fcmToken) {
        await this.userCollection.doc(userId).update({
            fcmToken,
            updatedAt: new Date(),
        });
    }
    async create(user) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const docRef = await this.userCollection.add({
            name: user.name,
            email: user.email,
            password: hashedPassword,
            createdBy: user.createdBy,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
        return userTeam_user_entity_1.UserEntity.create({
            id: docRef.id,
            name: user.name,
            email: user.email,
            password: hashedPassword,
            createdBy: user.createdBy,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
    async findByEmail(email) {
        const snapshot = await this.userCollection.where('email', '==', email).get();
        if (snapshot.empty) {
            return null;
        }
        const doc = snapshot.docs[0];
        const data = doc.data();
        return userTeam_user_entity_1.UserEntity.create({
            id: doc.id,
            name: data.name,
            email: data.email,
            password: data.password,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
        });
    }
    async findUsers() {
        const snapshot = await this.userCollection.get();
        return snapshot.docs.map(doc => userTeam_user_entity_1.UserEntity.create({
            id: doc.id,
            name: doc.data().name,
            email: doc.data().email,
            password: doc.data().password,
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
        }));
    }
    async findUsersByCreatedBy(createdBy) {
        const snapshot = await this.userCollection.where('createdBy', '==', createdBy).get();
        return snapshot.docs.map(doc => userTeam_user_entity_1.UserEntity.create({
            id: doc.id,
            name: doc.data().name,
            email: doc.data().email,
            password: doc.data().password,
            createdBy: doc.data().createdBy,
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
        }));
    }
    async getUserDetails(userId) {
        const doc = await this.userCollection.doc(userId).get();
        if (!doc.exists)
            return null;
        const data = doc.data();
        return { id: userId, name: data?.name || '', email: data?.email || '' };
    }
    async findById(id) {
        const doc = await this.userCollection.doc(id).get();
        if (!doc.exists) {
            return null;
        }
        const data = doc.data();
        return userTeam_user_entity_1.UserEntity.create({
            id: doc.id,
            name: data?.name,
            email: data?.email,
            password: data?.password,
            createdAt: data?.createdAt?.toDate(),
            updatedAt: data?.updatedAt?.toDate(),
        });
    }
    async findAll() {
        const snapshot = await this.userCollection.get();
        return snapshot.docs.map(doc => userTeam_user_entity_1.UserEntity.create({
            id: doc.id,
            name: doc.data().name,
            email: doc.data().email,
            password: doc.data().password,
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
        }));
    }
    async update(user) {
        await this.userCollection.doc(user.id).update({
            name: user.name,
            email: user.email,
            password: user.password,
            updatedAt: new Date(),
        });
        return user;
    }
    async delete(id) {
        await this.userCollection.doc(id).delete();
    }
};
exports.FirebaseUserRepository = FirebaseUserRepository;
exports.FirebaseUserRepository = FirebaseUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('FIRESTORE')),
    __metadata("design:paramtypes", [firebase_admin_1.firestore.Firestore])
], FirebaseUserRepository);
//# sourceMappingURL=firebase-user.repository.js.map