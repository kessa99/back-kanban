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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseBoardRepository = void 0;
const common_1 = require("@nestjs/common");
const kaban_board_entity_1 = require("src/domain/entities/kanban/kaban.board.entity");
const firebase = __importStar(require("firebase-admin"));
const firebase_admin_1 = require("firebase-admin");
const kaban_column_entity_1 = require("src/domain/entities/kanban/kaban.column.entity");
let FirebaseBoardRepository = class FirebaseBoardRepository {
    collection = firebase.firestore().collection('boards');
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