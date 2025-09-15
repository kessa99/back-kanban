import { CollaborationTaskViewEntity } from 'src/domain/entities/collaboration/collaboration.taskView.entity';
export interface ITaskViewRepository {
    create(view: CollaborationTaskViewEntity): Promise<CollaborationTaskViewEntity>;
    findByTaskId(taskId: string): Promise<CollaborationTaskViewEntity[]>;
    findByUserId(userId: string): Promise<CollaborationTaskViewEntity[]>;
}
