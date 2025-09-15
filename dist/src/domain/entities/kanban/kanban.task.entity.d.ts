import { Status } from "src/utils/constance/constance.status";
import { Priority } from "src/utils/constance/constance.priority";
export declare class KanbanTaskEntity {
    id: string;
    taskId: string;
    columnId: string;
    boardId: string;
    title: string;
    description: string;
    dueDate: Date;
    status: Status;
    assignTo: {
        id: string;
        name: string;
        email: string;
    }[];
    createdBy: string;
    priority: Priority;
    checklistIds: string[];
    createdAt: Date;
    updatedAt: Date;
    constructor(props: {
        id: string;
        taskId: string;
        columnId: string;
        boardId: string;
        title: string;
        description?: string;
        dueDate?: Date;
        status?: Status;
        assignTo?: {
            id: string;
            name: string;
            email: string;
        }[];
        createdBy: string;
        priority?: Priority;
        checklistIds?: string[];
        createdAt?: Date;
        updatedAt?: Date;
    });
    static create(props: {
        id?: string;
        taskId?: string;
        columnId: string;
        boardId: string;
        title: string;
        description?: string;
        dueDate?: Date;
        status?: Status;
        assignTo?: {
            id: string;
            name: string;
            email: string;
        }[];
        createdBy: string;
        priority?: Priority;
        checklistIds?: string[];
        createdAt?: Date;
        updatedAt?: Date;
    }): KanbanTaskEntity;
}
