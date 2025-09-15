// src/modules/tasks/entities/kanban-task.entity.ts
import { Status } from "src/utils/constance/constance.status";
import { Priority } from "src/utils/constance/constance.priority";

export class KanbanTaskEntity {
  id: string;
  taskId: string;
  columnId: string;
  boardId: string;
  title: string;
  description: string;
  dueDate: Date;
  status: Status;
  assignTo: { id: string; name: string; email: string }[];
  createdBy: string;
  priority: Priority;
  checklistIds: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(props: {
    id: string;
    taskId: string;
    columnId: string;
    boardId: string;
    title: string;
    description?: string;
    dueDate?: Date;
    status?: Status;
    assignTo?: { id: string; name: string; email: string }[];
    createdBy: string;
    priority?: Priority;
    checklistIds?: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.taskId = props.taskId || props.id;
    this.columnId = props.columnId;
    this.boardId = props.boardId;
    this.title = props.title;
    this.description = props.description || "";
    this.dueDate = props.dueDate || new Date();
    this.status = props.status || Status.PENDING;
    this.assignTo = props.assignTo || [{ id: props.createdBy, name: "", email: "" }];    this.createdBy = props.createdBy;
    this.priority = props.priority || Priority.MEDIUM;
    this.checklistIds = props.checklistIds || [];
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  static create(props: {
    id?: string;
    taskId?: string;
    columnId: string;
    boardId: string;
    title: string;
    description?: string;
    dueDate?: Date;
    status?: Status;
    assignTo?: { id: string; name: string; email: string }[];
    createdBy: string;
    priority?: Priority;
    checklistIds?: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    const id = props.id || crypto.randomUUID();
    return new KanbanTaskEntity({ ...props, id, taskId: props.taskId || id });
  }
}