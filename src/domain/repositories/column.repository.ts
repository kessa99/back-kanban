import { KanbanColumnEntity } from "../entities/kanban/kaban.column.entity";

export interface IColumnRepository {
    findAllByBoardId(boardId: string): Promise<KanbanColumnEntity[]>;
    create(column: KanbanColumnEntity): Promise<KanbanColumnEntity>;
    update(column: KanbanColumnEntity): Promise<KanbanColumnEntity>;
    delete(id: string): Promise<void>;
}