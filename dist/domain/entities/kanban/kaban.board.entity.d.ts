export declare class KanbanBoardEntity {
    id: string;
    name: string;
    description: string;
    teamId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    columnIds?: string[];
    constructor(props: {
        id: string;
        name: string;
        description: string;
        teamId: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        columnIds?: string[];
    });
    static create(props: {
        id: string;
        name: string;
        description: string;
        teamId: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        columnIds?: string[];
    }): KanbanBoardEntity;
}
