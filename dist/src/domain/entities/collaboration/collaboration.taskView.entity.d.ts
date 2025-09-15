export declare class CollaborationTaskViewEntity {
    id: string;
    taskId: string;
    userId: string;
    viewedAt: Date;
    constructor(props: {
        id: string;
        taskId: string;
        userId: string;
        viewedAt: Date;
    });
    static create(props: {
        id: string;
        taskId: string;
        userId: string;
        viewedAt: Date;
    }): CollaborationTaskViewEntity;
}
