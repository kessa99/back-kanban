"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMemberEntity = void 0;
class TeamMemberEntity {
    constructor(props) {
        this.id = props.id;
        this.teamId = props.teamId;
        this.creator = props.creator;
        this.role = props.role;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
    static create(props) {
        return new TeamMemberEntity({ ...props });
    }
}
exports.TeamMemberEntity = TeamMemberEntity;
//# sourceMappingURL=userTeam.teamMember.entity.js.map