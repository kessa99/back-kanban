import { KanbanColumnEntity } from '../../domain/entities/kanban/kaban.column.entity';
import { IColumnRepository } from '../../domain/repositories/column.repository';
export declare class FirebaseColumnRepository implements IColumnRepository {
    private readonly collection;
    findById(id: string): Promise<KanbanColumnEntity | null>;
    findAllByBoardId(boardId: string): Promise<KanbanColumnEntity[]>;
    create(column: KanbanColumnEntity): Promise<KanbanColumnEntity>;
    deleteByBoardId(boardId: string): Promise<void>;
    update(column: KanbanColumnEntity): Promise<KanbanColumnEntity>;
    getColumns(boardId: string): Promise<KanbanColumnEntity[]>;
    delete(id: string): Promise<void>;
}
