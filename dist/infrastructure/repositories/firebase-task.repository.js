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
    constructor() {
        this.taskCollection = (0, firebase_admin_1.firestore)().collection('tasks');
        this.columnCollection = (0, firebase_admin_1.firestore)().collection('columns');
        this.checklistCollection = (0, firebase_admin_1.firestore)().collection('checklists');
    }
    mapTask(doc) {
        const data = doc.data();
        if (!data)
            throw new common_1.NotFoundException(`Task data not found for ID ${doc.id}`);
        return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
        };
    }
    mapChecklist(doc) {
        const data = doc.data();
        if (!data)
            throw new common_1.NotFoundException(`Checklist data not found for ID ${doc.id}`);
        return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
        };
    }
    async create(task) {
        const docRef = await this.taskCollection.add({
            title: task.title,
            description: task.description,
            columnId: task.columnId,
            boardId: task.boardId,
            status: task.status,
            priority: task.priority,
            checklistIds: task.checklistIds ?? [],
            createdBy: task.createdBy,
            createdAt: task.createdAt ?? new Date(),
            updatedAt: task.updatedAt ?? new Date(),
        });
        return { ...task, id: docRef.id };
    }
    async getTasksByBoardId(boardId) {
        const snapshot = await this.taskCollection.where('boardId', '==', boardId).get();
        return snapshot.docs.map(doc => this.mapTask(doc));
    }
    async findAllByBoardId(boardId) {
        const snapshot = await this.taskCollection.where('boardId', '==', boardId).get();
        return snapshot.docs.map(doc => this.mapTask(doc));
    }
    async findById(id) {
        const doc = await this.taskCollection.doc(id).get();
        if (!doc.exists)
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        return this.mapTask(doc);
    }
    async update(task) {
        const docRef = this.taskCollection.doc(task.id);
        await docRef.update({
            title: task.title,
            description: task.description,
            columnId: task.columnId,
            boardId: task.boardId,
            status: task.status,
            priority: task.priority,
            checklistIds: task.checklistIds,
            updatedAt: new Date(),
        });
        return task;
    }
    async updateStatusTask(taskId, status) {
        const task = await this.findById(taskId);
        task.status = status;
        task.updatedAt = new Date();
        return this.update(task);
    }
    async delete(id) {
        const docRef = this.taskCollection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists)
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        await docRef.delete();
    }
    async deleteByBoardId(boardId) {
        const snapshot = await this.taskCollection.where('boardId', '==', boardId).get();
        if (snapshot.empty)
            return;
        const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);
    }
    async findAllByAssignedTo(userId) {
        const snapshot = await this.taskCollection.where('assignTo', 'array-contains', userId).get();
        return snapshot.docs.map(doc => this.mapTask(doc));
    }
    async createChecklist(checklist, createdBy) {
        console.log('----------------------------------------------------------------');
        console.log('Creating checklist in repository:', checklist);
        console.log('assignedTo value:', checklist.assignedTo);
        console.log('assignedTo type:', typeof checklist.assignedTo);
        console.log('----------------------------------------------------------------');
        const checklistData = {
            title: checklist.title,
            taskId: checklist.taskId,
            createdBy,
            completed: checklist.completed ?? false,
            startDate: checklist.startDate ?? null,
            endDate: checklist.endedAt ?? null,
            createdAt: checklist.createdAt ?? new Date(),
            updatedAt: checklist.updatedAt ?? new Date(),
        };
        if (checklist.assignedTo !== undefined) {
            checklistData['assignedTo'] = checklist.assignedTo;
        }
        console.log('----------------------------------------------------------------');
        console.log('Checklist data to save:', checklistData);
        console.log('----------------------------------------------------------------');
        const docRef = await this.checklistCollection.add(checklistData);
        return { ...checklist, id: docRef.id };
    }
    async getChecklistById(id) {
        const doc = await this.checklistCollection.doc(id).get();
        if (!doc.exists)
            throw new common_1.NotFoundException(`Checklist with ID ${id} not found`);
        return this.mapChecklist(doc);
    }
    async getColumnsByBoardId(boardId) {
        const snapshot = await this.columnCollection.where('boardId', '==', boardId).get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return { ...data, id: doc.id };
        });
    }
};
exports.FirebaseTaskRepository = FirebaseTaskRepository;
exports.FirebaseTaskRepository = FirebaseTaskRepository = __decorate([
    (0, common_1.Injectable)()
], FirebaseTaskRepository);
//# sourceMappingURL=firebase-task.repository.js.map