export declare class KanbanChecklistEntity {
    id: string;
    taskId: string;
    title: string;
    assignToId: string;
    assignToName: string;
    assignToEmail: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(props: {
        id: string;
        taskId: string;
        title: string;
        assignToId: string;
        assignToName: string;
        assignToEmail: string;
        completed?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    });
    static create(props: {
        id: string;
        taskId: string;
        title: string;
        assignToId: string;
        assignToName: string;
        assignToEmail: string;
        completed?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    }): KanbanChecklistEntity;
}
