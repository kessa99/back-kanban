"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    constructor(props) {
        this.id = props.id;
        this.name = props.name;
        this.email = props.email;
        this.password = props.password;
        this.createdBy = props.createdBy;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }
    static create(props) {
        return new UserEntity({ ...props });
    }
}
exports.UserEntity = UserEntity;
//# sourceMappingURL=userTeam.user.entity.js.map