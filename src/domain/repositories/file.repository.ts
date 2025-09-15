import { CollaborationAttachementEntity } from "../entities/collaboration/collaboration.attachement.entity";

export interface IFileRepository {
    create(file: CollaborationAttachementEntity): Promise<CollaborationAttachementEntity>;
    delete(id: string): Promise<void>;
}