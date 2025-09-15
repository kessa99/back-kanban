import { Injectable } from "@nestjs/common";
import { IBoardRepository } from "src/domain/repositories/board.repository";
import { KanbanBoardEntity } from "src/domain/entities/kanban/kaban.board.entity";
import * as firebase from 'firebase-admin';
import { firestore } from "firebase-admin";
import { KanbanColumnEntity } from "src/domain/entities/kanban/kaban.column.entity";

@Injectable()
export class FirebaseBoardRepository implements IBoardRepository {
    private readonly collection = firebase.firestore().collection('boards');

    async create(board: KanbanBoardEntity): Promise<KanbanBoardEntity> {
        const docRef = await this.collection.add({
          name: board.name,
          description: board.description,
          teamId: board.teamId,
          userId: board.userId,
          createdAt: board.createdAt,
          updatedAt: board.updatedAt,
        });
        return { ...board, id: docRef.id } as KanbanBoardEntity;
    }

    async findAllByTeamId(teamId: string): Promise<KanbanBoardEntity[]> {
        const snapshot = await this.collection.where('teamId', '==', teamId).get();
        return snapshot.docs.map(doc => {
          const data = doc.data();
          return KanbanBoardEntity.create({
            id: doc.id,
            name: data?.name,
            description: data?.description,
            teamId: data?.teamId,
            userId: data?.userId,
            createdAt: data?.createdAt.toDate(),
            updatedAt: data?.updatedAt.toDate(),
          });
        });
    }

    async findAllBoardUser(userId: string): Promise<KanbanBoardEntity[]> {
        const snapshot = await this.collection.where('userId', '==', userId).get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return KanbanBoardEntity.create({
                id: doc.id,
                name: data?.name,
                description: data?.description,
                teamId: data?.teamId,
                userId: data?.userId,
                createdAt: data?.createdAt.toDate(),
                updatedAt: data?.updatedAt.toDate(),
            });
        });
    }

    async findById(id: string): Promise<KanbanBoardEntity | null> {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists) return null;
        const data = doc.data();
        return KanbanBoardEntity.create({
          id: doc.id,
          name: data?.name,
          description: data?.description,
          teamId: data?.teamId,
          userId: data?.userId,
          createdAt: data?.createdAt.toDate(),
          updatedAt: data?.updatedAt.toDate(),
        });
    }

    async update(board: KanbanBoardEntity): Promise<KanbanBoardEntity> {
        const id = board.id;
        await this.collection.doc(id).update({
          ...board,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
        return this.findById(id) as Promise<KanbanBoardEntity>;
    }

    async getColumns(boardId: string): Promise<KanbanColumnEntity[]> {
        const snapshot = await this.collection.doc(boardId).collection('columns').get();
        return snapshot.docs.map(doc => {
          const data = doc.data();
          return KanbanColumnEntity.create({
            id: doc.id,
            name: data?.name,
            status: data?.status,
            boardId: data?.boardId,
            createdAt: data?.createdAt.toDate(),
            updatedAt: data?.updatedAt.toDate(),
          });
        });
    }
    
    async delete(id: string): Promise<void> {
        await this.collection.doc(id).delete();
    }
}