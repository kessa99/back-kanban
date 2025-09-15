"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaborationTaskViewEntity = void 0;
class CollaborationTaskViewEntity {
    constructor(props) {
        this.id = props.id;
        this.taskId = props.taskId;
        this.userId = props.userId;
        this.viewedAt = props.viewedAt;
    }
    static create(props) {
        return new CollaborationTaskViewEntity(props);
    }
}
exports.CollaborationTaskViewEntity = CollaborationTaskViewEntity;
//# sourceMappingURL=collaboration.taskView.entity.js.map