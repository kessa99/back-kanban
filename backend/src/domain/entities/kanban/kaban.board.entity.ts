export class KanbanBoardEntity {
    id: string;
    name: string;
    description: string;
    teamId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    columnIds?: string[];
  
    constructor(props: {
      id: string;
      name: string;
      description: string;
      teamId: string;
      userId: string;
      createdAt: Date;
      updatedAt: Date;
      columnIds?: string[];
    }) {
      this.id = props.id;
      this.name = props.name;
      this.description = props.description;
      this.teamId = props.teamId;
      this.userId = props.userId;
      this.createdAt = props.createdAt;
      this.updatedAt = props.updatedAt;
      this.columnIds = props.columnIds || [];
    }
  
    static create(props: {
      id: string;
      name: string;
      description: string;
      teamId: string;
      userId: string;
      createdAt: Date;
      updatedAt: Date;
      columnIds?: string[];
    }) {
      return new KanbanBoardEntity(props);
    }
  }