export declare class ChecklistItemEntity {
    id: string;
    taskId: string;
    title: string;
    completed: boolean;
    assignedTo: string;
    startDate?: Date;
    endedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    constructor(props: {
        id: string;
        taskId: string;
        title: string;
        completed?: boolean;
        assignedTo: string;
        startDate?: Date;
        endedAt?: Date;
        createdAt?: Date;
        updatedAt?: Date;
    });
    static create(props: {
        id?: string;
        taskId: string;
        title: string;
        completed?: boolean;
        assignedTo: string;
        startDate?: Date;
        endedAt?: Date;
        createdAt?: Date;
        updatedAt?: Date;
    }): ChecklistItemEntity;
}
