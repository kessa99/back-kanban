export declare class CollaborationAttachementEntity {
    id: string;
    userId: string;
    taskId: string;
    type: string;
    name: string;
    url: string;
    size: number;
    mimeType: string;
    thumbnailUrl: string;
    previewUrl: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(props: {
        id: string;
        userId: string;
        taskId: string;
        type: string;
        name: string;
        url: string;
        size: number;
        mimeType: string;
        thumbnailUrl: string;
        previewUrl: string;
        createdAt: Date;
        updatedAt: Date;
    });
    static create(props: {
        id: string;
        userId: string;
        taskId: string;
        type: string;
        name: string;
        url: string;
        size: number;
        mimeType: string;
        thumbnailUrl: string;
        previewUrl: string;
        createdAt: Date;
        updatedAt: Date;
    }): CollaborationAttachementEntity;
}
