import { Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { KanbanColumnEntity } from 'src/domain/entities/kanban/kaban.column.entity';
import { IColumnRepository } from 'src/domain/repositories/column.repository';

@Injectable()
export class FirebaseColumnRepository implements IColumnRepository {
  private readonly collection = firestore().collection('columns');

  async findById(id: string): Promise<KanbanColumnEntity | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    
    const data = doc.data();
    return KanbanColumnEntity.create({
      id: doc.id,
      name: data?.name,
      boardId: data?.boardId,
      status: data?.status,
      createdAt: data?.createdAt.toDate(),
      updatedAt: data?.updatedAt.toDate(),
    });
  }

  async findAllByBoardId(boardId: string): Promise<KanbanColumnEntity[]> {
    const snapshot = await this.collection.where('boardId', '==', boardId).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return KanbanColumnEntity.create({
        id: doc.id,
        name: data.name,
        boardId: data.boardId,
        status: data.status,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      });
    });
  }

  async create(column: KanbanColumnEntity): Promise<KanbanColumnEntity> {
    const docRef = await this.collection.add({
      name: column.name,
      boardId: column.boardId,
      status: column.status,
      createdAt: column.createdAt,
      updatedAt: column.updatedAt,
    });
    return { ...column, id: docRef.id } as KanbanColumnEntity;
  }

  async deleteByBoardId(boardId: string): Promise<void> {
    const snapshot = await this.collection.where('boardId', '==', boardId).get();
    const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
  }

  async update(column: KanbanColumnEntity): Promise<KanbanColumnEntity> {
    const docRef = this.collection.doc(column.id);
    await docRef.update({
      name: column.name,
      boardId: column.boardId,
      status: column.status,
      updatedAt: column.updatedAt,
    });
    return column;
  }

  async getColumns(boardId: string): Promise<KanbanColumnEntity[]> {
    const snapshot = await this.collection.where('boardId', '==', boardId).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return KanbanColumnEntity.create({
        id: doc.id,
        name: data?.name,
        boardId: data?.boardId,
        status: data?.status,
        createdAt: data?.createdAt.toDate(),
        updatedAt: data?.updatedAt.toDate(),
      });
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = this.collection.doc(id);
    await docRef.delete();
  }
}