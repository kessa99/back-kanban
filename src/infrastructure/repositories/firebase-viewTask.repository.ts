import { Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { CollaborationTaskViewEntity } from '../../domain/entities/collaboration/collaboration.taskView.entity';
import { ITaskViewRepository } from '../../domain/repositories/view.repository';

@Injectable()
export class FirebaseTaskViewRepository implements ITaskViewRepository {
  private readonly collection = firestore().collection('task_views');

  async create(view: CollaborationTaskViewEntity): Promise<CollaborationTaskViewEntity> {
    const docRef = await this.collection.add({
      taskId: view.taskId,
      userId: view.userId,
      viewedAt: view.viewedAt,
    });
    return { ...view, id: docRef.id } as CollaborationTaskViewEntity;
  }

  async findByTaskId(taskId: string): Promise<CollaborationTaskViewEntity[]> {
    const snapshot = await this.collection.where('taskId', '==', taskId).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return CollaborationTaskViewEntity.create({
        id: doc.id,
        taskId: data.taskId,
        userId: data.userId,
        viewedAt: data.viewedAt.toDate(),
      });
    });
  }

  async findByUserId(userId: string): Promise<CollaborationTaskViewEntity[]> {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return CollaborationTaskViewEntity.create({
        id: doc.id,
        taskId: data.taskId,
        userId: data.userId,
        viewedAt: data.viewedAt.toDate(),
      });
    });
  }
}