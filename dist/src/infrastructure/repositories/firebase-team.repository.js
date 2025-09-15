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
exports.FirebaseTeamRepository = void 0;
const userTeam_team_entity_1 = require("../../domain/entities/userTeam/userTeam.team.entity");
const firebase_admin_1 = require("firebase-admin");
const common_1 = require("@nestjs/common");
let FirebaseTeamRepository = class FirebaseTeamRepository {
    constructor(firestore) {
        this.firestore = firestore;
        this.teamCollection = this.firestore.collection('teams');
    }
    async create(team) {
        const docRef = await this.teamCollection.add({
            name: team.name,
            ownerId: team.ownerId,
            members: team.members,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
        });
        return userTeam_team_entity_1.TeamEntity.create({
            id: docRef.id,
            name: team.name,
            ownerId: team.ownerId,
            members: team.members,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
        });
    }
    async getTeamMembers(id) {
        const doc = await this.teamCollection.doc(id).get();
        if (!doc.exists)
            return [];
        const data = doc.data();
        return data?.members;
    }
    async findById(id) {
        const doc = await this.teamCollection.doc(id).get();
        if (!doc.exists)
            return null;
        const data = doc.data();
        return userTeam_team_entity_1.TeamEntity.create({
            id: doc.id,
            name: data?.name,
            ownerId: data?.ownerId,
            members: data?.members,
            createdAt: data?.createdAt?.toDate(),
            updatedAt: data?.updatedAt?.toDate(),
        });
    }
    async findAll() {
        const snapshot = await this.teamCollection.get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return userTeam_team_entity_1.TeamEntity.create({
                id: doc.id,
                name: data?.name,
                ownerId: data?.ownerId,
                members: data?.members,
                createdAt: data?.createdAt?.toDate(),
                updatedAt: data?.updatedAt?.toDate(),
            });
        });
    }
    async findByOwnerId(ownerId) {
        const snapshot = await this.teamCollection.where('ownerId', '==', ownerId).get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return userTeam_team_entity_1.TeamEntity.create({
                id: doc.id,
                name: data?.name,
                ownerId: data?.ownerId,
                members: data?.members,
                createdAt: data?.createdAt?.toDate(),
                updatedAt: data?.updatedAt?.toDate(),
            });
        });
    }
    async update(team) {
        const docRef = this.teamCollection.doc(team.id);
        const updateData = {
            name: team.name,
            ownerId: team.ownerId,
            members: team.members || [],
            updatedAt: new Date(),
        };
        const filteredData = Object.fromEntries(Object.entries(updateData).filter(([_, value]) => value !== undefined));
        await docRef.update(filteredData);
        return team;
    }
    async delete(id) {
        await this.teamCollection.doc(id).delete();
    }
};
exports.FirebaseTeamRepository = FirebaseTeamRepository;
exports.FirebaseTeamRepository = FirebaseTeamRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('FIRESTORE')),
    __metadata("design:paramtypes", [firebase_admin_1.firestore.Firestore])
], FirebaseTeamRepository);
//# sourceMappingURL=firebase-team.repository.js.map