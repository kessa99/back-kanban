import { KanbanColumnEntity } from '../../domain/entities/kanban/kaban.column.entity';
import { ChecklistItemEntity } from '../../domain/entities/kanban/kanban.checkList.entity';
import { KanbanTaskEntity } from '../../domain/entities/kanban/kanban.task.entity';
import { ITaskRepository } from '../../domain/repositories/task.repository';
import { Status } from '../../utils/constance/constance.status';
export declare class FirebaseTaskRepository implements ITaskRepository {
    private readonly taskCollection;
    private readonly columnCollection;
    private readonly checklistCollection;
    private mapTask;
    private mapChecklist;
    create(task: KanbanTaskEntity): Promise<KanbanTaskEntity>;
    getTasksByBoardId(boardId: string): Promise<KanbanTaskEntity[]>;
    findAllByBoardId(boardId: string): Promise<KanbanTaskEntity[]>;
    findById(id: string): Promise<KanbanTaskEntity>;
    update(task: KanbanTaskEntity): Promise<KanbanTaskEntity>;
    updateStatusTask(taskId: string, status: Status): Promise<KanbanTaskEntity>;
    delete(id: string): Promise<void>;
    deleteByBoardId(boardId: string): Promise<void>;
    findAllByAssignedTo(userId: string): Promise<KanbanTaskEntity[]>;
    createChecklist(checklist: ChecklistItemEntity, createdBy: string): Promise<ChecklistItemEntity>;
    getChecklistById(id: string): Promise<ChecklistItemEntity>;
    getColumnsByBoardId(boardId: string): Promise<KanbanColumnEntity[]>;
}
