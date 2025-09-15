import { KanbanCommentEntity } from "../entities/collaboration/collaboration.comment.entity";

export interface ICommentRepository {
    create(comment: KanbanCommentEntity): Promise<KanbanCommentEntity>;
    delete(id: string): Promise<void>;
}