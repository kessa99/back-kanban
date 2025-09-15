"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseFileRepository = exports.FirebaseCommentRepository = void 0;
const common_1 = require("@nestjs/common");
const firebase_admin_1 = require("firebase-admin");
let FirebaseCommentRepository = class FirebaseCommentRepository {
    collection = (0, firebase_admin_1.firestore)().collection('comments');
    async create(comment) {
        const docRef = await this.collection.add({
            content: comment.content,
            taskId: comment.taskId,
            userId: comment.userId,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        });
        return { ...comment, id: docRef.id };
    }
    async delete(id) {
        const docRef = this.collection.doc(id);
        await docRef.delete();
    }
};
exports.FirebaseCommentRepository = FirebaseCommentRepository;
exports.FirebaseCommentRepository = FirebaseCommentRepository = __decorate([
    (0, common_1.Injectable)()
], FirebaseCommentRepository);
let FirebaseFileRepository = class FirebaseFileRepository {
    collection = (0, firebase_admin_1.firestore)().collection('files');
    async create(file) {
        const docRef = await this.collection.add({
            name: file.name,
            url: file.url,
            taskId: file.taskId,
            userId: file.userId,
            type: file.type,
            size: file.size,
            mimeType: file.mimeType,
            thumbnailUrl: file.thumbnailUrl,
            previewUrl: file.previewUrl,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
        });
        return { ...file, id: docRef.id };
    }
    async delete(id) {
        const docRef = this.collection.doc(id);
        await docRef.delete();
    }
};
exports.FirebaseFileRepository = FirebaseFileRepository;
exports.FirebaseFileRepository = FirebaseFileRepository = __decorate([
    (0, common_1.Injectable)()
], FirebaseFileRepository);
//# sourceMappingURL=firebase-commentAndFile.repo.js.map