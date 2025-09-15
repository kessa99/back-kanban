export declare class KanbanCommentEntity {
    id: string;
    content: string;
    taskId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(props: {
        id: string;
        content: string;
        taskId: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    });
    static create(props: {
        id: string;
        content: string;
        taskId: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }): KanbanCommentEntity;
}
