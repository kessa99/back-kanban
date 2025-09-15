import { UserEntity } from "../entities/userTeam/userTeam.user.entity";

export interface IUserRepository {
  create(user: UserEntity): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  update(user: UserEntity): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}