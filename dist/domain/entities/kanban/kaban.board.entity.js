"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanBoardEntity = void 0;
class KanbanBoardEntity {
    constructor(props) {
        this.id = props.id;
        this.name = props.name;
        this.description = props.description;
        this.teamId = props.teamId;
        this.userId = props.userId;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.columnIds = props.columnIds || [];
    }
    static create(props) {
        return new KanbanBoardEntity(props);
    }
}
exports.KanbanBoardEntity = KanbanBoardEntity;
//# sourceMappingURL=kaban.board.entity.js.map