import { UserEntity } from "../../domain/entities/userTeam/userTeam.user.entity";
import { IUserRepository } from "../../domain/repositories/user.repositories";
import { Injectable, Inject } from "@nestjs/common";
import { firestore } from "firebase-admin";

@Injectable()
export class FirebaseUserRepository implements IUserRepository {
  private readonly userCollection: firestore.CollectionReference;

  constructor(
    @Inject('FIRESTORE') private readonly firestore: firestore.Firestore,
  ) {
    this.userCollection = this.firestore.collection("users");
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const docRef = await this.userCollection.add({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      createdBy: user.createdBy, // Ajouter cette ligne
      teamId: user.teamId, // Ajouter cette ligne aussi
      otp: user.otp,
      otpExpiresAt: user.otpExpiresAt,
      otpVerified: user.otpVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    
    return UserEntity.create({
      id: docRef.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      createdBy: user.createdBy, // Ajouter cette ligne
      teamId: user.teamId, // Ajouter cette ligne aussi
      otp: user.otp,
      otpExpiresAt: user.otpExpiresAt,
      otpVerified: user.otpVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const snapshot = await this.userCollection.where('email', '==', email).get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    
    return UserEntity.create({
      id: doc.id,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      otp: data.otp,
      otpExpiresAt: data.otpExpiresAt?.toDate(),
      otpVerified: data.otpVerified,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    });
  }

  async findUsers(): Promise<UserEntity[]> {
    const snapshot = await this.userCollection.get();
    return snapshot.docs.map(doc => UserEntity.create({
      id: doc.id,
      name: doc.data().name,
      email: doc.data().email,
      password: doc.data().password,
      role: doc.data().role,
      otp: doc.data().otp,
      otpExpiresAt: doc.data().otpExpiresAt?.toDate(),
      otpVerified: doc.data().otpVerified,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));
  }

  async findUsersByCreatedBy(createdBy: string): Promise<UserEntity[]> {
    const snapshot = await this.userCollection.where('createdBy', '==', createdBy).get();
    return snapshot.docs.map(doc => UserEntity.create({
      id: doc.id,
      name: doc.data().name,
      email: doc.data().email,
  
      password: doc.data().password,
      role: doc.data().role,
      createdBy: doc.data().createdBy,
      teamId: doc.data().teamId,
      otp: doc.data().otp,
      otpExpiresAt: doc.data().otpExpiresAt?.toDate(),
      otpVerified: doc.data().otpVerified,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));
  }

  async getUserDetails(userId: string): Promise<{ id: string; name: string; email: string } | null> {
    const doc = await this.userCollection.doc(userId).get();
    if (!doc.exists) return null;
    const data = doc.data();
    return { id: userId, name: data?.name || '', email: data?.email || '' };
  }

  async getUsersDetails(userIds: string[]): Promise<{ id: string; name: string; email: string }[]> {
    const snapshot = await this.userCollection.where('id', 'in', userIds).get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || '',
      email: doc.data().email || '',
    }));
  }
  async findById(id: string): Promise<UserEntity | null> {
    const doc = await this.userCollection.doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = doc.data();
    
    return UserEntity.create({
      id: doc.id,
      name: data?.name,
      email: data?.email,
      password: data?.password,
      role: data?.role,
      otp: data?.otp,
      otpExpiresAt: data?.otpExpiresAt?.toDate(),
      otpVerified: data?.otpVerified,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    });
  }

  async findAll(): Promise<UserEntity[]> {
    const snapshot = await this.userCollection.get();
    return snapshot.docs.map(doc => UserEntity.create({
      id: doc.id,
      name: doc.data().name,
      email: doc.data().email,
      password: doc.data().password,
      role: doc.data().role,
      otp: doc.data().otp,
      otpExpiresAt: doc.data().otpExpiresAt?.toDate(),
      otpVerified: doc.data().otpVerified,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));
  }

  async update(user: UserEntity): Promise<UserEntity> {
    await this.userCollection.doc(user.id).update({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      otp: user.otp,
      otpExpiresAt: user.otpExpiresAt,
      otpVerified: user.otpVerified,
      updatedAt: new Date(),
    });
    
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.userCollection.doc(id).delete();
  }
}