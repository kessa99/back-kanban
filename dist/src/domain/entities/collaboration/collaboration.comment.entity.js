"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanCommentEntity = void 0;
class KanbanCommentEntity {
    id;
    content;
    taskId;
    userId;
    createdAt;
    updatedAt;
    constructor(props) {
        this.id = props.id;
        this.content = props.content;
        this.taskId = props.taskId;
        this.userId = props.userId;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
    static create(props) {
        return new KanbanCommentEntity(props);
    }
}
exports.KanbanCommentEntity = KanbanCommentEntity;
//# sourceMappingURL=collaboration.comment.entity.js.map