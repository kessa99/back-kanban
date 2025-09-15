import { IBoardRepository } from "src/domain/repositories/board.repository";
import { KanbanBoardEntity } from "src/domain/entities/kanban/kaban.board.entity";
import { KanbanColumnEntity } from "src/domain/entities/kanban/kaban.column.entity";
export declare class FirebaseBoardRepository implements IBoardRepository {
    private readonly collection;
    create(board: KanbanBoardEntity): Promise<KanbanBoardEntity>;
    findAllByTeamId(teamId: string): Promise<KanbanBoardEntity[]>;
    findAllBoardUser(userId: string): Promise<KanbanBoardEntity[]>;
    findById(id: string): Promise<KanbanBoardEntity | null>;
    update(board: KanbanBoardEntity): Promise<KanbanBoardEntity>;
    getColumns(boardId: string): Promise<KanbanColumnEntity[]>;
    delete(id: string): Promise<void>;
}
