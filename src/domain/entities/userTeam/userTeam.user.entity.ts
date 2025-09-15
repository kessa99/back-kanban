import { Role } from "src/utils/constance/constance.role";

export class UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  teamId?: string;
  createdBy?: string;
  otp: string;
  otpExpiresAt: Date;
  otpVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  private constructor(props: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    teamId?: string;
    createdBy?: string;
    otp: string;
    otpExpiresAt: Date;
    otpVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.role = props.role;
    this.teamId = props.teamId;
    this.createdBy = props.createdBy;
    this.otp = props.otp;
    this.otpExpiresAt = props.otpExpiresAt;
    this.otpVerified = props.otpVerified ?? false;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  static create(props: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    teamId?: string;
    createdBy?: string;
    otp: string;
    otpExpiresAt: Date;
    otpVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }): UserEntity {
    return new UserEntity({ ...props });
  }
}
