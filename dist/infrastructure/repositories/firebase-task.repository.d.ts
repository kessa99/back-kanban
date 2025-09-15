import { KanbanColumnEntity } from 'src/domain/entities/kanban/kaban.column.entity';
import { KanbanChecklistEntity } from 'src/domain/entities/kanban/kanban.checkList.entity';
import { KanbanTaskEntity } from 'src/domain/entities/kanban/kanban.task.entity';
import { ITaskRepository } from 'src/domain/repositories/task.repository';
import { Status } from 'src/utils/constance/constance.status';
export declare class FirebaseTaskRepository implements ITaskRepository {
    private readonly collection;
    create(task: KanbanTaskEntity): Promise<KanbanTaskEntity>;
    findAllByBoardId(boardId: string): Promise<KanbanTaskEntity[]>;
    findAllTasksByBoardId(boardId: string): Promise<KanbanTaskEntity[]>;
    createChecklist(checklist: KanbanChecklistEntity, createdBy: string): Promise<KanbanChecklistEntity>;
    getColumnsByBoardId(boardId: string): Promise<KanbanColumnEntity[]>;
    deleteByBoardId(boardId: string): Promise<void>;
    updateStatusTask(taskId: string, status: Status): Promise<KanbanTaskEntity>;
    update(task: KanbanTaskEntity): Promise<KanbanTaskEntity>;
    findAllByAssignedTo(assignedTo: string): Promise<KanbanTaskEntity[]>;
    findById(id: string): Promise<KanbanTaskEntity>;
    delete(id: string): Promise<void>;
    getChecklistById(id: string): Promise<KanbanChecklistEntity>;
}
