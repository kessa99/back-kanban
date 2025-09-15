import { Injectable, NotFoundException } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { KanbanColumnEntity } from 'src/domain/entities/kanban/kaban.column.entity';
import { KanbanChecklistEntity } from 'src/domain/entities/kanban/kanban.checkList.entity';
import { KanbanTaskEntity } from 'src/domain/entities/kanban/kanban.task.entity';
import { ITaskRepository } from 'src/domain/repositories/task.repository';
import { Status } from 'src/utils/constance/constance.status';

@Injectable()
export class FirebaseTaskRepository implements ITaskRepository {
  private readonly collection = firestore().collection('tasks');

  async create(task: KanbanTaskEntity): Promise<KanbanTaskEntity> {
    const docRef = await this.collection.add({
      title: task.title,
      description: task.description,
      columnId: task.columnId,
      boardId: task.boardId,
      dueDate: task.dueDate,
      status: task.status,
      assignTo: task.assignTo,
      priority: task.priority,
      checklistIds: task.checklistIds,
      createdBy: task.createdBy,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
    return { ...task, id: docRef.id } as KanbanTaskEntity;
  }

  async findAllByBoardId(boardId: string): Promise<KanbanTaskEntity[]> {
    const snapshot = await this.collection.where('boardId', '==', boardId).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { ...data, id: doc.id } as KanbanTaskEntity;
    });
  }

  async findAllTasksByBoardId(boardId: string): Promise<KanbanTaskEntity[]> {
    const snapshot = await this.collection.where('boardId', '==', boardId).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { ...data, id: doc.id } as KanbanTaskEntity;
    });
  }

  async createChecklist(checklist: KanbanChecklistEntity, createdBy: string): Promise<KanbanChecklistEntity> {
    const docRef = await this.collection.add({
      title: checklist.title,
      taskId: checklist.taskId,
      createdBy: createdBy,
      createdAt: checklist.createdAt,
      updatedAt: checklist.updatedAt,
    });
    return { ...checklist, id: docRef.id } as KanbanChecklistEntity;
  }

  async getColumnsByBoardId(boardId: string): Promise<KanbanColumnEntity[]> {
    const columnsCollection = firestore().collection('columns');
    const snapshot = await columnsCollection.where('boardId', '==', boardId).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { ...data, id: doc.id } as KanbanColumnEntity;
    });
  }

  async deleteByBoardId(boardId: string): Promise<void> {
    const snapshot = await this.collection.where('boardId', '==', boardId).get();
    if (snapshot.empty) return;
    const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
  }

  async updateStatusTask(taskId: string, status: Status): Promise<KanbanTaskEntity> {
    const task = await this.findById(taskId);
    task.status = status;
    task.updatedAt = new Date();
    return this.update(task);
  }
  
  async update(task: KanbanTaskEntity): Promise<KanbanTaskEntity> {
    const docRef = this.collection.doc(task.id);
    await docRef.update({
      title: task.title,
      description: task.description,
      columnId: task.columnId,
      boardId: task.boardId,
      dueDate: task.dueDate,
      status: task.status,
      assignTo: task.assignTo,
      priority: task.priority,
      checklistIds: task.checklistIds,
      updatedAt: task.updatedAt,
    });
    return task;
  }

  async findAllByAssignedTo(assignedTo: string): Promise<KanbanTaskEntity[]> {
    const snapshot = await this.collection.where('assignTo', 'array-contains', { id: assignedTo }).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        dueDate: data.dueDate?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as KanbanTaskEntity;
    });
  }

  async findById(id: string): Promise<KanbanTaskEntity> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw new NotFoundException(`Task with ID ${id} not found`);
    const data = doc.data();
    if (!data) throw new NotFoundException(`Task data not found for ID ${id}`);
    return {
      ...data,
      id: doc.id,
      dueDate: data.dueDate?.toDate(),
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as KanbanTaskEntity;
  }

  async delete(id: string): Promise<void> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw new NotFoundException(`Task with ID ${id} not found`);
    await docRef.delete();
  }

  async getChecklistById(id: string): Promise<KanbanChecklistEntity> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw new NotFoundException(`Checklist with ID ${id} not found`);
    const data = doc.data();
    if (!data) throw new NotFoundException(`Checklist data not found for ID ${id}`);
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as KanbanChecklistEntity;
  }
}