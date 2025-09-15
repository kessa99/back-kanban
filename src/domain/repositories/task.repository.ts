import { Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { KanbanTaskEntity } from 'src/domain/entities/kanban/kanban.task.entity';

export interface ITaskRepository {
  create(task: KanbanTaskEntity): Promise<KanbanTaskEntity>;
  deleteByBoardId(boardId: string): Promise<void>;
  update(task: KanbanTaskEntity): Promise<KanbanTaskEntity>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<KanbanTaskEntity>;
}
