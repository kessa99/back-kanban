"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaborationAttachementEntity = void 0;
class CollaborationAttachementEntity {
    id;
    userId;
    taskId;
    type;
    name;
    url;
    size;
    mimeType;
    thumbnailUrl;
    previewUrl;
    createdAt;
    updatedAt;
    constructor(props) {
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
    static create(props) {
        return new CollaborationAttachementEntity(props);
    }
}
exports.CollaborationAttachementEntity = CollaborationAttachementEntity;
//# sourceMappingURL=collaboration.attachement.entity.js.map