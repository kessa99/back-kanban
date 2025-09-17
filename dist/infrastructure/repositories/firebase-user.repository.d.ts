import { UserEntity } from "../../domain/entities/userTeam/userTeam.user.entity";
import { IUserRepository } from "../../domain/repositories/user.repositories";
import { firestore } from "firebase-admin";
export declare class FirebaseUserRepository implements IUserRepository {
    private readonly firestore;
    private readonly userCollection;
    constructor(firestore: firestore.Firestore);
    create(user: UserEntity): Promise<UserEntity>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findUsers(): Promise<UserEntity[]>;
    findUsersByCreatedBy(createdBy: string): Promise<UserEntity[]>;
    getUserDetails(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
    } | null>;
    findById(id: string): Promise<UserEntity | null>;
    findAll(): Promise<UserEntity[]>;
    update(user: UserEntity): Promise<UserEntity>;
    delete(id: string): Promise<void>;
}
