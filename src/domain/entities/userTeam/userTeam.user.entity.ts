import { Role } from "../../../utils/constance/constance.role";
import { Status } from "../../../utils/constance/constance.status";

export class UserEntity {
  id: string;
  name: string;
  email: string;
  role: Role;
  password: string
  statusInvite?: Status;
  emailVerified: boolean
  otp: string
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  fcmToken?: string;

  private constructor(props: {
    id: string;
    name: string;
    email: string;
    role: Role;
    statusInvite?: Status;
    emailVerified: boolean
    otp: string
    password: string;
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
    fcmToken?: string;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.role = props.role;
    this.statusInvite = props.statusInvite;
    this.emailVerified = props.emailVerified
    this.otp = props.otp
    this.password = props.password;
    this.createdBy = props.createdBy;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.fcmToken = props.fcmToken;
  }

  static create(props: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    statusInvite?: Status;
    emailVerified: boolean
    otp: string
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
    fcmToken?: string;
  }): UserEntity {
    return new UserEntity({ ...props });
  }
}
