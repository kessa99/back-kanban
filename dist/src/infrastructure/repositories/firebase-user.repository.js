"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
let FirebaseUserRepository = class FirebaseUserRepository {
    firestore;
    userCollection;
    constructor(firestore) {
        this.firestore = firestore;
        this.userCollection = this.firestore.collection("users");
    }
    async create(user) {
        const docRef = await this.userCollection.add({
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            createdBy: user.createdBy,
            teamId: user.teamId,
            otp: user.otp,
            otpExpiresAt: user.otpExpiresAt,
            otpVerified: user.otpVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
        return userTeam_user_entity_1.UserEntity.create({
            id: docRef.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            createdBy: user.createdBy,
            teamId: user.teamId,
            otp: user.otp,
            otpExpiresAt: user.otpExpiresAt,
            otpVerified: user.otpVerified,
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
            role: data.role,
            otp: data.otp,
            otpExpiresAt: data.otpExpiresAt?.toDate(),
            otpVerified: data.otpVerified,
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
            role: doc.data().role,
            otp: doc.data().otp,
            otpExpiresAt: doc.data().otpExpiresAt?.toDate(),
            otpVerified: doc.data().otpVerified,
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
            role: doc.data().role,
            createdBy: doc.data().createdBy,
            teamId: doc.data().teamId,
            otp: doc.data().otp,
            otpExpiresAt: doc.data().otpExpiresAt?.toDate(),
            otpVerified: doc.data().otpVerified,
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
    async getUsersDetails(userIds) {
        const snapshot = await this.userCollection.where('id', 'in', userIds).get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name || '',
            email: doc.data().email || '',
        }));
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
            role: data?.role,
            otp: data?.otp,
            otpExpiresAt: data?.otpExpiresAt?.toDate(),
            otpVerified: data?.otpVerified,
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
            role: doc.data().role,
            otp: doc.data().otp,
            otpExpiresAt: doc.data().otpExpiresAt?.toDate(),
            otpVerified: doc.data().otpVerified,
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
        }));
    }
    async update(user) {
        await this.userCollection.doc(user.id).update({
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            otp: user.otp,
            otpExpiresAt: user.otpExpiresAt,
            otpVerified: user.otpVerified,
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