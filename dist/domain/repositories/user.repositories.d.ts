import { UserEntity } from "../entities/userTeam/userTeam.user.entity";
export interface IUserRepository {
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
