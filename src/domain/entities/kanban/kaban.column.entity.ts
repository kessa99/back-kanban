import { Status } from '../../../utils/constance/constance.status';

export class KanbanColumnEntity {
    id: string;
    name: string;
    boardId: string;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
  
    constructor(props: {
      id: string;
      name: string;
      boardId: string;
      status: Status;
      createdAt: Date;
      updatedAt: Date;
    }) {
      this.id = props.id;
      this.name = props.name;
      this.boardId = props.boardId;
      this.status = props.status;
      this.createdAt = props.createdAt;
      this.updatedAt = props.updatedAt;
    }
  
    static create(props: {
      id: string;
      name: string;
      boardId: string;
      status: Status;
      createdAt: Date;
      updatedAt: Date;
    }) {
      return new KanbanColumnEntity(props);
    }
  }