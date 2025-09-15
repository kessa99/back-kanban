export class CollaborationNotificationEntity {
    id: string;
    userId: string;
    taskId: string;
    type: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}