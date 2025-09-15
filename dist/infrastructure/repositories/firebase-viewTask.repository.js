"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseTaskViewRepository = void 0;
const common_1 = require("@nestjs/common");
const firebase_admin_1 = require("firebase-admin");
const collaboration_taskView_entity_1 = require("../../domain/entities/collaboration/collaboration.taskView.entity");
let FirebaseTaskViewRepository = class FirebaseTaskViewRepository {
    collection = (0, firebase_admin_1.firestore)().collection('task_views');
    async create(view) {
        const docRef = await this.collection.add({
            taskId: view.taskId,
            userId: view.userId,
            viewedAt: view.viewedAt,
        });
        return { ...view, id: docRef.id };
    }
    async findByTaskId(taskId) {
        const snapshot = await this.collection.where('taskId', '==', taskId).get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return collaboration_taskView_entity_1.CollaborationTaskViewEntity.create({
                id: doc.id,
                taskId: data.taskId,
                userId: data.userId,
                viewedAt: data.viewedAt.toDate(),
            });
        });
    }
    async findByUserId(userId) {
        const snapshot = await this.collection.where('userId', '==', userId).get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return collaboration_taskView_entity_1.CollaborationTaskViewEntity.create({
                id: doc.id,
                taskId: data.taskId,
                userId: data.userId,
                viewedAt: data.viewedAt.toDate(),
            });
        });
    }
};
exports.FirebaseTaskViewRepository = FirebaseTaskViewRepository;
exports.FirebaseTaskViewRepository = FirebaseTaskViewRepository = __decorate([
    (0, common_1.Injectable)()
], FirebaseTaskViewRepository);
//# sourceMappingURL=firebase-viewTask.repository.js.map