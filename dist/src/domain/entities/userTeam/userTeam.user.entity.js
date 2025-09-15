"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    id;
    name;
    email;
    password;
    role;
    teamId;
    createdBy;
    otp;
    otpExpiresAt;
    otpVerified;
    createdAt;
    updatedAt;
    constructor(props) {
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
    static create(props) {
        return new UserEntity({ ...props });
    }
}
exports.UserEntity = UserEntity;
//# sourceMappingURL=userTeam.user.entity.js.map