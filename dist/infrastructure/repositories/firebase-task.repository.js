"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseTaskRepository = void 0;
const common_1 = require("@nestjs/common");
const firebase_admin_1 = require("firebase-admin");
let FirebaseTaskRepository = class FirebaseTaskRepository {
    collection = (0, firebase_admin_1.firestore)().collection('tasks');
    async create(task) {
        const docRef = await this.collection.add({
            title: task.title,
            description: task.description,
            columnId: task.columnId,
            boardId: task.boardId,
            dueDate: task.dueDate,
            status: task.status,
            assignTo: task.assignTo,
            priority: task.priority,
            checklistIds: task.checklistIds,
            createdBy: task.createdBy,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        });
        return { ...task, id: docRef.id };
    }
    async findAllByBoardId(boardId) {
        const snapshot = await this.collection.where('boardId', '==', boardId).get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return { ...data, id: doc.id };
        });
    }
    async findAllTasksByBoardId(boardId) {
        const snapshot = await this.collection.where('boardId', '==', boardId).get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return { ...data, id: doc.id };
        });
    }
    async createChecklist(checklist, createdBy) {
        const docRef = await this.collection.add({
            title: checklist.title,
            taskId: checklist.taskId,
            createdBy: createdBy,
            createdAt: checklist.createdAt,
            updatedAt: checklist.updatedAt,
        });
        return { ...checklist, id: docRef.id };
    }
    async getColumnsByBoardId(boardId) {
        const columnsCollection = (0, firebase_admin_1.firestore)().collection('columns');
        const snapshot = await columnsCollection.where('boardId', '==', boardId).get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return { ...data, id: doc.id };
        });
    }
    async deleteByBoardId(boardId) {
        const snapshot = await this.collection.where('boardId', '==', boardId).get();
        if (snapshot.empty)
            return;
        const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);
    }
    async updateStatusTask(taskId, status) {
        const task = await this.findById(taskId);
        task.status = status;
        task.updatedAt = new Date();
        return this.update(task);
    }
    async update(task) {
        const docRef = this.collection.doc(task.id);
        await docRef.update({
            title: task.title,
            description: task.description,
            columnId: task.columnId,
            boardId: task.boardId,
            dueDate: task.dueDate,
            status: task.status,
            assignTo: task.assignTo,
            priority: task.priority,
            checklistIds: task.checklistIds,
            updatedAt: task.updatedAt,
        });
        return task;
    }
    async findAllByAssignedTo(assignedTo) {
        const snapshot = await this.collection.where('assignTo', 'array-contains', { id: assignedTo }).get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                dueDate: data.dueDate?.toDate(),
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
            };
        });
    }
    async findById(id) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists)
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        const data = doc.data();
        if (!data)
            throw new common_1.NotFoundException(`Task data not found for ID ${id}`);
        return {
            ...data,
            id: doc.id,
            dueDate: data.dueDate?.toDate(),
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
        };
    }
    async delete(id) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists)
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        await docRef.delete();
    }
    async getChecklistById(id) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists)
            throw new common_1.NotFoundException(`Checklist with ID ${id} not found`);
        const data = doc.data();
        if (!data)
            throw new common_1.NotFoundException(`Checklist data not found for ID ${id}`);
        return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
        };
    }
};
exports.FirebaseTaskRepository = FirebaseTaskRepository;
exports.FirebaseTaskRepository = FirebaseTaskRepository = __decorate([
    (0, common_1.Injectable)()
], FirebaseTaskRepository);
//# sourceMappingURL=firebase-task.repository.js.map