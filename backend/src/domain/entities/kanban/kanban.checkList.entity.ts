export class KanbanChecklistEntity {
    id: string;
    taskId: string;
    title: string;
    assignToId: string;
    assignToName: string;
    assignToEmail: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
  
    constructor(props: {
      id: string;
      taskId: string;
      title: string;
      assignToId: string;
      assignToName: string;
      assignToEmail: string;
      completed?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
    }) {
      this.id = props.id;
      this.taskId = props.taskId;
      this.title = props.title;
      this.assignToId = props.assignToId;
      this.assignToName = props.assignToName;
      this.assignToEmail = props.assignToEmail;
      this.completed = props.completed || false;
      this.createdAt = props.createdAt || new Date();
      this.updatedAt = props.updatedAt || new Date();
    }
  
    static create(props: {
      id: string;
      taskId: string;
      title: string;
      assignToId: string;
      assignToName: string;
      assignToEmail: string;
      completed?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
    }) {
      return new KanbanChecklistEntity(props);
    }
  }
  