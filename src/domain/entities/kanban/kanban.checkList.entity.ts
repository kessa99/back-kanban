export class ChecklistItemEntity {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
  startDate?: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: {
    id: string;
    taskId: string;
    title: string;
    completed?: boolean;
    assignedTo?: string;
    startDate?: Date;
    endedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.taskId = props.taskId;
    this.title = props.title;
    this.completed = props.completed || false;
    this.assignedTo = props.assignedTo;
    this.startDate = props.startDate
    this.endedAt = props.endedAt
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  static create(props: {
    id?: string;
    taskId: string;
    title: string;
    completed?: boolean;
    assignedTo?: string;
    startDate?: Date;
    endedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    const id = props.id || crypto.randomUUID();
    return new ChecklistItemEntity({ ...props, id });
  }
}