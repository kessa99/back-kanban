import { UserEntity } from "../../domain/entities/userTeam/userTeam.user.entity";
import { IUserRepository } from "../../domain/repositories/user.repositories";
import { Injectable, Inject } from "@nestjs/common";
import { firestore } from "firebase-admin";
import * as bcrypt from 'bcryptjs';
import * as admin from 'firebase-admin';
import { UpdateFcmDto } from "../../utils/dto/users/UpdateFcmDto";
import { use } from "passport";

@Injectable()
export class FirebaseUserRepository implements IUserRepository {
  private readonly userCollection: firestore.CollectionReference;

  constructor(
    @Inject('FIRESTORE') private readonly firestore: firestore.Firestore,
  ) {
    this.userCollection = this.firestore.collection("users");
  }

  async updateFcmToken(userId: string, fcmToken:string ): Promise<void> {
    await this.userCollection.doc(userId).update({
      fcmToken,
      updatedAt: new Date(),
    });
  }
  
  async create(user: UserEntity): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
  
    const data = {
      name: user.name,
      email: user.email,
      password: hashedPassword,
      role: user.role,
      emailVerified: user.emailVerified,
      otp: user.otp,
      createdBy: user.createdBy,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  
    const docRef = await this.userCollection.add(data);
  
    return UserEntity.create({
      id: docRef.id,
      ...data
    });
  }
  

  // entity to dto
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
      role: data.role,
      emailVerified: data.emailVerified,
      otp: data.otp,
      password: data.password,
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
      emailVerified: doc.data().emailVerified,
      otp: doc.data().otp,
      role: doc.data().role,
      password: doc.data().password,
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
      emailVerified: doc.data().emailVerified,
      otp: doc.data().otp,
      role: doc.data().role,
      password: doc.data().password,
      createdBy: doc.data().createdBy,
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

  // async getUsersDetails(userIds: string[]): Promise<{ id: string; name: string; email: string }[]> {
  //   const snapshot = await this.userCollection.where('id', 'in', userIds).get();
  //   return snapshot.docs.map(doc => ({
  //     id: doc.id,
  //     name: doc.data().name || '',
  //     email: doc.data().email || '',
  //   }));
  // }

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
      role: data?.role,
      emailVerified: data?.emailVerified,
      otp: data?.otp,
      password: data?.password,
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
      role: doc.data().role,
      emailVerified: doc.data().emailVerified,
      otp: doc.data().otp,
      password: doc.data().password,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));
  }

  async update(user: UserEntity): Promise<UserEntity> {
    await this.userCollection.doc(user.id).update({
      name: user.name,
      email: user.email,
      otp: user.otp,
      password: user.password,
      updatedAt: new Date(),
    });
    
    return user;
  }

  async updateVerifyOtp(userId: string, emailVerified: boolean, otp: string): Promise<UserEntity> {
    await this.userCollection.doc(userId).update({
      emailVerified,
      otp,
      updatedAt: new Date(),
    });

    const doc = await this.userCollection.doc(userId).get();
    const data = doc.data();

    return UserEntity.create({
      id: doc.id,
      name: data.name,
      email: data.email,
      role: data.role,
      emailVerified: data.emailVerified,
      otp: '',
      password: data.password,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    });
  }

  async updateOtp(userId: string, otp: string, expiresAt: Date): Promise<UserEntity> {
    await this.userCollection.doc(userId).update({
      otp,
      expiresAt,
      updatedAt: new Date(),
    });

    const doc = await this.userCollection.doc(userId).get();
    const data = doc.data();

    return UserEntity.create({
      id: doc.id,
      name: data.name,
      email: data.email,
      role: data.role,
      emailVerified: data.emailVerified,
      otp: data.otp,
      password: data.password,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.userCollection.doc(id).delete();
  }
}