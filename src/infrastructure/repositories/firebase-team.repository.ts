import { TeamEntity } from '../../domain/entities/userTeam/userTeam.team.entity';
import { ITeamRepository } from '../../domain/repositories/teamrepository';
import { firestore } from 'firebase-admin';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseTeamRepository implements ITeamRepository {
  private readonly teamCollection: firestore.CollectionReference;

  constructor(
    @Inject('FIRESTORE') private readonly firestore: firestore.Firestore,
  ) {
    this.teamCollection = this.firestore.collection('teams');
  }

  async create(team: TeamEntity): Promise<TeamEntity> {
    const docRef = await this.teamCollection.add({
        name: team.name,
        ownerId: team.ownerId,
        members: team.members,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
    });
    return TeamEntity.create({
        id: docRef.id,
        name: team.name,
        ownerId: team.ownerId,
        members: team.members,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
    });
  }

  async getTeamMembers(id: string): Promise<string[]> {
    const doc = await this.teamCollection.doc(id).get();
    if (!doc.exists) return [];
    const data = doc.data();
    return data?.members;
  }

  async findById(id: string): Promise<TeamEntity | null> {
    const doc = await this.teamCollection.doc(id).get();
    if (!doc.exists) return null;
    
    const data = doc.data();
    return TeamEntity.create({
      id: doc.id,
      name: data?.name,
      ownerId: data?.ownerId,
      members: data?.members,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    });
  }

  async findAll(): Promise<TeamEntity[]> {
    const snapshot = await this.teamCollection.get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return TeamEntity.create({
        id: doc.id,
        name: data?.name,
        ownerId: data?.ownerId,
        members: data?.members,
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate(),
      });
    });
  }

  async findByOwnerId(ownerId: string): Promise<TeamEntity[]> {
    const snapshot = await this.teamCollection.where('ownerId', '==', ownerId).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return TeamEntity.create({
        id: doc.id,
        name: data?.name,
        ownerId: data?.ownerId,
        members: data?.members,
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate(),
      });
    });
  }

  async update(team: TeamEntity): Promise<TeamEntity> {
    const docRef = this.teamCollection.doc(team.id);
    
    // Créer un objet de mise à jour sans valeurs undefined
    const updateData: any = {
      name: team.name,
      ownerId: team.ownerId,
      members: team.members || [],
      updatedAt: new Date(),
    };
    
    // Filtrer les valeurs undefined
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );
    
    await docRef.update(filteredData);
    return team;
  }

  async delete(id: string): Promise<void> {
    await this.teamCollection.doc(id).delete();
  }
}