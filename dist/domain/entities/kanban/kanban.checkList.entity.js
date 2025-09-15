"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanChecklistEntity = void 0;
class KanbanChecklistEntity {
    id;
    taskId;
    title;
    assignToId;
    assignToName;
    assignToEmail;
    completed;
    createdAt;
    updatedAt;
    constructor(props) {
        this.id = props.id;
        this.taskId = props.taskId;
        this.title = props.title;
        this.assignToId = props.assignToId;
        this.assignToName = props.assignToName;
        this.assignToEmail = props.assignToEmail;
        this.completed = props.completed || false;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }
    static create(props) {
        return new KanbanChecklistEntity(props);
    }
}
exports.KanbanChecklistEntity = KanbanChecklistEntity;
//# sourceMappingURL=kanban.checkList.entity.js.map