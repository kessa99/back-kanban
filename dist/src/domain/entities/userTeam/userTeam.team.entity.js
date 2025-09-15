"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamEntity = void 0;
class TeamEntity {
    constructor(props) {
        this.id = props.id;
        this.name = props.name;
        this.ownerId = props.ownerId;
        this.members = props.members || [];
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }
    static create(props) {
        return new TeamEntity({ ...props });
    }
}
exports.TeamEntity = TeamEntity;
//# sourceMappingURL=userTeam.team.entity.js.map