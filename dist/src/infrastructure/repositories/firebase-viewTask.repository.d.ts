import { CollaborationTaskViewEntity } from 'src/domain/entities/collaboration/collaboration.taskView.entity';
import { ITaskViewRepository } from 'src/domain/repositories/view.repository';
export declare class FirebaseTaskViewRepository implements ITaskViewRepository {
    private readonly collection;
    create(view: CollaborationTaskViewEntity): Promise<CollaborationTaskViewEntity>;
    findByTaskId(taskId: string): Promise<CollaborationTaskViewEntity[]>;
    findByUserId(userId: string): Promise<CollaborationTaskViewEntity[]>;
}
