import { Role } from 'src/utils/constance/constance.role';

export interface TeamMember {
  userId: string;
  role: 'admin' | 'member' | 'viewer';
  joinedAt: Date;
}

export class TeamEntity {
  id: string;
  name: string;
  ownerId: string;
  members: string[]; // Keep as string[] for now
  createdAt: Date;
  updatedAt: Date;

  private constructor(props: {
    id: string;
    name: string;
    ownerId: string;
    members?: string[]; // Keep as string[]
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.ownerId = props.ownerId;
    this.members = props.members || [];
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  static create(props: {
    id: string;
    name: string;
    ownerId: string;
    members?: string[]; // Keep as string[]
    createdAt?: Date;
    updatedAt?: Date;
  }): TeamEntity {
    return new TeamEntity({ ...props });
  }
}