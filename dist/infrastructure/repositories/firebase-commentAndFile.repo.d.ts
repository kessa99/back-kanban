import { KanbanCommentEntity } from "../../domain/entities/collaboration/collaboration.comment.entity";
import { ICommentRepository } from "../../domain/repositories/comment.repository";
import { IFileRepository } from "../../domain/repositories/file.repository";
import { CollaborationAttachementEntity } from "../../domain/entities/collaboration/collaboration.attachement.entity";
export declare class FirebaseCommentRepository implements ICommentRepository {
    private readonly collection;
    create(comment: KanbanCommentEntity): Promise<KanbanCommentEntity>;
    delete(id: string): Promise<void>;
}
export declare class FirebaseFileRepository implements IFileRepository {
    private readonly collection;
    create(file: CollaborationAttachementEntity): Promise<CollaborationAttachementEntity>;
    delete(id: string): Promise<void>;
}
