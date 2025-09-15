"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseColumnRepository = void 0;
const common_1 = require("@nestjs/common");
const firebase_admin_1 = require("firebase-admin");
const kaban_column_entity_1 = require("../../domain/entities/kanban/kaban.column.entity");
let FirebaseColumnRepository = class FirebaseColumnRepository {
    constructor() {
        this.collection = (0, firebase_admin_1.firestore)().collection('columns');
    }
    async findById(id) {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists)
            return null;
        const data = doc.data();
        return kaban_column_entity_1.KanbanColumnEntity.create({
            id: doc.id,
            name: data?.name,
            boardId: data?.boardId,
            status: data?.status,
            createdAt: data?.createdAt.toDate(),
            updatedAt: data?.updatedAt.toDate(),
        });
    }
    async findAllByBoardId(boardId) {
        const snapshot = await this.collection.where('boardId', '==', boardId).get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return kaban_column_entity_1.KanbanColumnEntity.create({
                id: doc.id,
                name: data.name,
                boardId: data.boardId,
                status: data.status,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
            });
        });
    }
    async create(column) {
        const docRef = await this.collection.add({
            name: column.name,
            boardId: column.boardId,
            status: column.status,
            createdAt: column.createdAt,
            updatedAt: column.updatedAt,
        });
        return { ...column, id: docRef.id };
    }
    async deleteByBoardId(boardId) {
        const snapshot = await this.collection.where('boardId', '==', boardId).get();
        const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);
    }
    async update(column) {
        const docRef = this.collection.doc(column.id);
        await docRef.update({
            name: column.name,
            boardId: column.boardId,
            status: column.status,
            updatedAt: column.updatedAt,
        });
        return column;
    }
    async getColumns(boardId) {
        const snapshot = await this.collection.where('boardId', '==', boardId).get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return kaban_column_entity_1.KanbanColumnEntity.create({
                id: doc.id,
                name: data?.name,
                boardId: data?.boardId,
                status: data?.status,
                createdAt: data?.createdAt.toDate(),
                updatedAt: data?.updatedAt.toDate(),
            });
        });
    }
    async delete(id) {
        const docRef = this.collection.doc(id);
        await docRef.delete();
    }
};
exports.FirebaseColumnRepository = FirebaseColumnRepository;
exports.FirebaseColumnRepository = FirebaseColumnRepository = __decorate([
    (0, common_1.Injectable)()
], FirebaseColumnRepository);
//# sourceMappingURL=firebase-column.repository.js.map