"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecklistItemEntity = void 0;
class ChecklistItemEntity {
    constructor(props) {
        this.id = props.id;
        this.taskId = props.taskId;
        this.title = props.title;
        this.completed = props.completed || false;
        this.assignedTo = props.assignedTo;
        this.startDate = props.startDate;
        this.endedAt = props.endedAt;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }
    static create(props) {
        const id = props.id || crypto.randomUUID();
        return new ChecklistItemEntity({ ...props, id });
    }
}
exports.ChecklistItemEntity = ChecklistItemEntity;
//# sourceMappingURL=kanban.checkList.entity.js.map