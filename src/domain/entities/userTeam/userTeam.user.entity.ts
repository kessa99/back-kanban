export class UserEntity {
  id: string;
  name: string;
  email: string;
  password: string
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;

  private constructor(props: {
    id: string;
    name: string;
    email: string;
    password: string;
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.createdBy = props.createdBy;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  static create(props: {
    id: string;
    name: string;
    email: string;
    password: string;
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): UserEntity {
    return new UserEntity({ ...props });
  }
}
