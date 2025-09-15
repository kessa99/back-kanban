import { Injectable } from "@nestjs/common";
import { firestore } from "firebase-admin";
import { KanbanCommentEntity } from "src/domain/entities/collaboration/collaboration.comment.entity";
import { ICommentRepository } from "src/domain/repositories/comment.repository";
import { IFileRepository } from "src/domain/repositories/file.repository";
import { CollaborationAttachementEntity } from "src/domain/entities/collaboration/collaboration.attachement.entity";

@Injectable()
export class FirebaseCommentRepository implements ICommentRepository {
    private readonly collection = firestore().collection('comments');

    async create(comment: KanbanCommentEntity): Promise<KanbanCommentEntity> {
        const docRef = await this.collection.add({
            content: comment.content,
            taskId: comment.taskId,
            userId: comment.userId,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        });
        return { ...comment, id: docRef.id } as KanbanCommentEntity;
    }

    async delete(id: string): Promise<void> {
        const docRef = this.collection.doc(id);
        await docRef.delete();
    }
}

@Injectable()
export class FirebaseFileRepository implements IFileRepository {
    private readonly collection = firestore().collection('files');

    async create(file: CollaborationAttachementEntity): Promise<CollaborationAttachementEntity> {
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
        return { ...file, id: docRef.id } as CollaborationAttachementEntity;
    }

    async delete(id: string): Promise<void> {
        const docRef = this.collection.doc(id);
        await docRef.delete();
    }
}