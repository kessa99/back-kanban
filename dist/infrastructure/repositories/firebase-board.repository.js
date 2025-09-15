"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseBoardRepository = void 0;
const common_1 = require("@nestjs/common");
const kaban_board_entity_1 = require("src/domain/entities/kanban/kaban.board.entity");
const firebase = require("firebase-admin");
const firebase_admin_1 = require("firebase-admin");
const kaban_column_entity_1 = require("src/domain/entities/kanban/kaban.column.entity");
let FirebaseBoardRepository = class FirebaseBoardRepository {
    constructor() {
        this.collection = firebase.firestore().collection('boards');
    }
    async create(board) {
        const docRef = await this.collection.add({
            name: board.name,
            description: board.description,
            teamId: board.teamId,
            userId: board.userId,
            createdAt: board.createdAt,
            updatedAt: board.updatedAt,
        });
        return { ...board, id: docRef.id };
    }
    async findAllByTeamId(teamId) {
        const snapshot = await this.collection.where('teamId', '==', teamId).get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return kaban_board_entity_1.KanbanBoardEntity.create({
                id: doc.id,
                name: data?.name,
                description: data?.description,
                teamId: data?.teamId,
                userId: data?.userId,
                createdAt: data?.createdAt.toDate(),
                updatedAt: data?.updatedAt.toDate(),
            });
        });
    }
    async findAllBoardUser(userId) {
        const snapshot = await this.collection.where('userId', '==', userId).get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return kaban_board_entity_1.KanbanBoardEntity.create({
                id: doc.id,
                name: data?.name,
                description: data?.description,
                teamId: data?.teamId,
                userId: data?.userId,
                createdAt: data?.createdAt.toDate(),
                updatedAt: data?.updatedAt.toDate(),
            });
        });
    }
    async findById(id) {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists)
            return null;
        const data = doc.data();
        return kaban_board_entity_1.KanbanBoardEntity.create({
            id: doc.id,
            name: data?.name,
            description: data?.description,
            teamId: data?.teamId,
            userId: data?.userId,
            createdAt: data?.createdAt.toDate(),
            updatedAt: data?.updatedAt.toDate(),
        });
    }
    async update(board) {
        const id = board.id;
        await this.collection.doc(id).update({
            ...board,
            updatedAt: firebase_admin_1.firestore.FieldValue.serverTimestamp(),
        });
        return this.findById(id);
    }
    async getColumns(boardId) {
        const snapshot = await this.collection.doc(boardId).collection('columns').get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return kaban_column_entity_1.KanbanColumnEntity.create({
                id: doc.id,
                name: data?.name,
                status: data?.status,
                boardId: data?.boardId,
                createdAt: data?.createdAt.toDate(),
                updatedAt: data?.updatedAt.toDate(),
            });
        });
    }
    async delete(id) {
        await this.collection.doc(id).delete();
    }
};
exports.FirebaseBoardRepository = FirebaseBoardRepository;
exports.FirebaseBoardRepository = FirebaseBoardRepository = __decorate([
    (0, common_1.Injectable)()
], FirebaseBoardRepository);
//# sourceMappingURL=firebase-board.repository.js.map