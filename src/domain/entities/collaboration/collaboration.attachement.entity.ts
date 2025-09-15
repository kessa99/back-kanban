export class CollaborationAttachementEntity {
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
    }) {
        this.id = props.id;
        this.userId = props.userId;
        this.taskId = props.taskId;
        this.type = props.type;
        this.name = props.name;
        this.url = props.url;
        this.size = props.size;
        this.mimeType = props.mimeType;
        this.thumbnailUrl = props.thumbnailUrl;
        this.previewUrl = props.previewUrl;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

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
    }) {
        return new CollaborationAttachementEntity(props);
    }
}