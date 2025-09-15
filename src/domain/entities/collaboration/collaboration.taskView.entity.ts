export class CollaborationTaskViewEntity {
    id: string;
    taskId: string;
    userId: string;
    viewedAt: Date;
  
    constructor(props: {
      id: string;
      taskId: string;
      userId: string;
      viewedAt: Date;
    }) {
      this.id = props.id;
      this.taskId = props.taskId;
      this.userId = props.userId;
      this.viewedAt = props.viewedAt;
    }
  
    static create(props: {
      id: string;
      taskId: string;
      userId: string;
      viewedAt: Date;
    }) {
      return new CollaborationTaskViewEntity(props);
    }
  }