"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanTaskEntity = void 0;
const constance_status_1 = require("../../../utils/constance/constance.status");
const constance_priority_1 = require("../../../utils/constance/constance.priority");
class KanbanTaskEntity {
    id;
    taskId;
    columnId;
    boardId;
    title;
    description;
    dueDate;
    status;
    assignTo;
    createdBy;
    priority;
    checklistIds;
    createdAt;
    updatedAt;
    constructor(props) {
        this.id = props.id;
        this.taskId = props.taskId || props.id;
        this.columnId = props.columnId;
        this.boardId = props.boardId;
        this.title = props.title;
        this.description = props.description || "";
        this.dueDate = props.dueDate || new Date();
        this.status = props.status || constance_status_1.Status.PENDING;
        this.assignTo = props.assignTo || [{ id: props.createdBy, name: "", email: "" }];
        this.createdBy = props.createdBy;
        this.priority = props.priority || constance_priority_1.Priority.MEDIUM;
        this.checklistIds = props.checklistIds || [];
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }
    static create(props) {
        const id = props.id || crypto.randomUUID();
        return new KanbanTaskEntity({ ...props, id, taskId: props.taskId || id });
    }
}
exports.KanbanTaskEntity = KanbanTaskEntity;
//# sourceMappingURL=kanban.task.entity.js.map