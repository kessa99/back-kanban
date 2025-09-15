import { KanbanBoardEntity } from "../entities/kanban/kaban.board.entity";
import { KanbanColumnEntity } from "../entities/kanban/kaban.column.entity";

export interface IBoardRepository {
    create(board: KanbanBoardEntity): Promise<KanbanBoardEntity>;
    findById(id: string): Promise<KanbanBoardEntity | null>;
    findAllByTeamId(teamId: string): Promise<KanbanBoardEntity[]>;
    update(board: KanbanBoardEntity): Promise<KanbanBoardEntity>;
    delete(id: string): Promise<void>;
    getColumns(boardId: string): Promise<KanbanColumnEntity[]>;
}