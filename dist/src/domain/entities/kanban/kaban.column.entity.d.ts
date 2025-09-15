import { Status } from 'src/utils/constance/constance.status';
export declare class KanbanColumnEntity {
    id: string;
    name: string;
    boardId: string;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
    constructor(props: {
        id: string;
        name: string;
        boardId: string;
        status: Status;
        createdAt: Date;
        updatedAt: Date;
    });
    static create(props: {
        id: string;
        name: string;
        boardId: string;
        status: Status;
        createdAt: Date;
        updatedAt: Date;
    }): KanbanColumnEntity;
}
