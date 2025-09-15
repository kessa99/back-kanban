export class KanbanCommentEntity {
    id: string;
    content: string;
    taskId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  
    constructor(props: {
      id: string;
      content: string;
      taskId: string;
      userId: string;
      createdAt: Date;
      updatedAt: Date;
    }) {
      this.id = props.id;
      this.content = props.content;
      this.taskId = props.taskId;
      this.userId = props.userId;
      this.createdAt = props.createdAt;
      this.updatedAt = props.updatedAt;
    }
  
    static create(props: {
      id: string;
      content: string;
      taskId: string;
      userId: string;
      createdAt: Date;
      updatedAt: Date;
    }) {
      return new KanbanCommentEntity(props);
    }
  }