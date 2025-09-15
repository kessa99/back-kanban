"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanColumnEntity = void 0;
class KanbanColumnEntity {
    constructor(props) {
        this.id = props.id;
        this.name = props.name;
        this.boardId = props.boardId;
        this.status = props.status;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
    static create(props) {
        return new KanbanColumnEntity(props);
    }
}
exports.KanbanColumnEntity = KanbanColumnEntity;
//# sourceMappingURL=kaban.column.entity.js.map