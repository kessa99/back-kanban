"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamController = void 0;
const common_1 = require("@nestjs/common");
const team_service_1 = require("src/interface/service/team.service");
const create_team_dto_1 = require("src/utils/dto/team/create-team.dto");
const update_team_dto_1 = require("src/utils/dto/team/update-team.dto");
const passport_1 = require("@nestjs/passport");
const formatRespons_1 = require("src/utils/formatResponse/formatRespons");
const jwt_1 = require("@nestjs/jwt");
let TeamController = class TeamController {
    constructor(teamService, jwtService) {
        this.teamService = teamService;
        this.jwtService = jwtService;
    }
    async createTeam(createTeamDto, req, res) {
        try {
            const user = req.user;
            if (!user.otpVerified) {
                return (0, formatRespons_1.formatResponse)(res, 400, "failed", "You can access this feature after verifying your email", null);
            }
            const team = await this.teamService.createTeam(createTeamDto, user.id);
            return (0, formatRespons_1.formatResponse)(res, 201, "success", "Team created successfully", team);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Error creating team", error.message);
        }
    }
    async getTeams(req, res) {
        try {
            const user = req.user;
            console.log('User:', user);
            if (!user.otpVerified) {
                return (0, formatRespons_1.formatResponse)(res, 400, "failed", "You can access this feature after verifying your email", null);
            }
            const teams = await this.teamService.findAll(user.id);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Teams fetched successfully", teams);
        }
        catch (error) {
            console.error('Error fetching teams:', error);
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Error fetching teams", error.message);
        }
    }
    async getTeamDetails(id, req, res) {
        try {
            const user = req.user;
            if (!user.otpVerified) {
                return (0, formatRespons_1.formatResponse)(res, 400, "failed", "You can access this feature after verifying your email", null);
            }
            const team = await this.teamService.getTeamWithMembers(id, user.id);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Team details fetched successfully", team);
        }
        catch (error) {
            console.error('Error fetching team details:', error);
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Error fetching team details", error.message);
        }
    }
    async updateTeam(id, updateTeamDto, req, res) {
        try {
            const user = req.user;
            if (!user.otpVerified) {
                return (0, formatRespons_1.formatResponse)(res, 400, "failed", "You can access this feature after verifying your email", null);
            }
            const team = await this.teamService.update(id, updateTeamDto, user.id);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Team updated successfully", team);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Team update failed", error);
        }
    }
    async deleteTeam(id, req, res) {
        try {
            const user = req.user;
            if (!user.otpVerified) {
                return (0, formatRespons_1.formatResponse)(res, 400, "failed", "You can access this feature after verifying your email", null);
            }
            const team = await this.teamService.delete(id, user.id);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Team deleted successfully", team);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Team deletion failed", error);
        }
    }
    async addMember(id, body, req, res) {
        try {
            const user = req.user;
            console.log('Adding member to team:', id, 'Member ID:', body.memberId);
            if (!user.otpVerified) {
                return (0, formatRespons_1.formatResponse)(res, 400, "failed", "You can access this feature after verifying your email", null);
            }
            await this.teamService.addMember(id, body.memberId, user.id);
            const updatedTeam = await this.teamService.findById(id, user.id);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Member added successfully", updatedTeam);
        }
        catch (error) {
            console.error('Error adding member:', error);
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Member addition failed", error.message);
        }
    }
    async removeMember(id, memberId, req, res) {
        try {
            const user = req.user;
            console.log('Removing member from team:', id, 'Member ID:', memberId);
            if (!user.otpVerified) {
                return (0, formatRespons_1.formatResponse)(res, 400, "failed", "You can access this feature after verifying your email", null);
            }
            await this.teamService.removeMember(id, memberId, user.id);
            const updatedTeam = await this.teamService.findById(id, user.id);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Member removed successfully", updatedTeam);
        }
        catch (error) {
            console.error('Error removing member:', error);
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Member removal failed", error.message);
        }
    }
    async getMembers(id, req, res) {
        try {
            const user = req.user;
            if (!user.otpVerified) {
                return (0, formatRespons_1.formatResponse)(res, 400, "failed", "You can access this feature after verifying your email", null);
            }
            const members = await this.teamService.getMembers(id);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Members fetched successfully", members);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Members not found", error);
        }
    }
    async changeMemberRole(id, memberId, body, req, res) {
        try {
            const user = req.user;
            console.log('=== CHANGE MEMBER ROLE CONTROLLER ===');
            console.log('Team ID:', id);
            console.log('Member ID:', memberId);
            console.log('New Role:', body.role);
            console.log('User ID:', user.id);
            if (!user.otpVerified) {
                return (0, formatRespons_1.formatResponse)(res, 400, "failed", "You can access this feature after verifying your email", null);
            }
            await this.teamService.changeMemberRole(id, memberId, body.role, user.id);
            const updatedTeam = await this.teamService.getTeamWithMembers(id, user.id);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Member role updated successfully", updatedTeam);
        }
        catch (error) {
            console.error('Error changing member role:', error);
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Role change failed", error.message);
        }
    }
};
exports.TeamController = TeamController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_team_dto_1.CreateTeamDto, Object, Object]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "createTeam", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "getTeams", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "getTeamDetails", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_team_dto_1.UpdateTeamDto, Object, Object]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "updateTeam", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "deleteTeam", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)(':id/members/:memberId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Get)(':id/members'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Put)(':id/members/:memberId/role'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "changeMemberRole", null);
exports.TeamController = TeamController = __decorate([
    (0, common_1.Controller)('teams'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [team_service_1.TeamService,
        jwt_1.JwtService])
], TeamController);
//# sourceMappingURL=team.controller.js.map