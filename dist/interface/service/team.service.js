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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamService = void 0;
const common_1 = require("@nestjs/common");
const userTeam_team_entity_1 = require("../../domain/entities/userTeam/userTeam.team.entity");
const firebase_team_repository_1 = require("../../infrastructure/repositories/firebase-team.repository");
const user_service_1 = require("./user.service");
let TeamService = class TeamService {
    constructor(teamRepository, userService) {
        this.teamRepository = teamRepository;
        this.userService = userService;
    }
    async createTeam(createTeamDto, ownerId) {
        const team = userTeam_team_entity_1.TeamEntity.create({
            id: '',
            name: createTeamDto.name,
            ownerId: ownerId,
            members: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return this.teamRepository.create(team);
    }
    async findById(id, userId) {
        const team = await this.teamRepository.findById(id);
        if (!team) {
            throw new common_1.NotFoundException('Team not found');
        }
        console.log('DEBUG TeamService.findById:', {
            teamId: id,
            userId,
            teamOwnerId: team.ownerId,
            teamMembers: team.members,
            isOwner: team.ownerId === userId,
            isMember: team.members.includes(userId)
        });
        if (team.ownerId !== userId && !team.members.includes(userId)) {
            console.log('DEBUG: User not authorized, returning null');
            return null;
        }
        const memberDetails = await Promise.all(team.members.map(async (memberId) => {
            try {
                const user = await this.userService.findUserById(memberId);
                console.log(`User found for ${memberId}:`, user);
                return {
                    id: memberId,
                    userId: memberId,
                    teamId: id,
                    role: 'member',
                    user: user ? {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt
                    } : null,
                    joinedAt: new Date().toISOString()
                };
            }
            catch (error) {
                console.error(`Error fetching user ${memberId}:`, error);
                return {
                    id: memberId,
                    userId: memberId,
                    teamId: id,
                    role: 'member',
                    user: null,
                    joinedAt: new Date().toISOString()
                };
            }
        }));
        console.log('Member details:', memberDetails);
        return {
            id: team.id,
            name: team.name,
            ownerId: team.ownerId,
            members: memberDetails,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt
        };
    }
    async findAll(userId) {
        const teams = await this.teamRepository.findByOwnerId(userId);
        const teamsWithMembers = await Promise.all(teams.map(async (team) => {
            const memberDetails = await Promise.all(team.members.map(async (memberId) => {
                try {
                    const user = await this.userService.findUserById(memberId);
                    return {
                        id: memberId,
                        userId: memberId,
                        teamId: team.id,
                        role: 'member',
                        user: user ? {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt
                        } : null,
                        joinedAt: new Date().toISOString()
                    };
                }
                catch (error) {
                    console.error(`Error fetching user ${memberId}:`, error);
                    return {
                        id: memberId,
                        userId: memberId,
                        teamId: team.id,
                        role: 'member',
                        user: null,
                        joinedAt: new Date().toISOString()
                    };
                }
            }));
            return {
                id: team.id,
                name: team.name,
                ownerId: team.ownerId,
                members: memberDetails,
                createdAt: team.createdAt,
                updatedAt: team.updatedAt
            };
        }));
        return teamsWithMembers;
    }
    async getTeamMembers(id, ownerId) {
        const team = await this.teamRepository.findById(id);
        if (!team)
            throw new common_1.NotFoundException(`Team with ID ${id} not found`);
        if (team.ownerId !== ownerId && !team.members.includes(ownerId)) {
            throw new common_1.UnauthorizedException('Access denied: Not a member of this team');
        }
        return team.members;
    }
    async update(id, updates, ownerId) {
        const team = await this.teamRepository.findById(id);
        if (!team)
            throw new common_1.NotFoundException(`Team with ID ${id} not found`);
        if (team.ownerId !== ownerId)
            throw new common_1.UnauthorizedException('Only the owner can update this team');
        const updatedTeam = { ...team, ...updates, updatedAt: new Date() };
        return this.teamRepository.update(updatedTeam);
    }
    async delete(id, ownerId) {
        const team = await this.teamRepository.findById(id);
        if (!team)
            throw new common_1.NotFoundException(`Team with ID ${id} not found`);
        if (team.ownerId !== ownerId)
            throw new common_1.UnauthorizedException('Only the owner can delete this team');
        await this.teamRepository.delete(id);
    }
    async addMember(id, memberId, ownerId) {
        console.log('=== ADD MEMBER DEBUG ===');
        console.log('Team ID:', id);
        console.log('Member ID:', memberId);
        console.log('Owner ID:', ownerId);
        const team = await this.teamRepository.findById(id);
        if (!team)
            throw new common_1.NotFoundException(`Team with ID ${id} not found`);
        console.log('Team found:', team);
        console.log('Team members before:', team.members);
        console.log('Team ownerId:', team.ownerId);
        const getUser = await this.userService.findUserById(memberId);
        if (!getUser)
            throw new common_1.NotFoundException(`User not found`);
        if (getUser.id === ownerId)
            throw new common_1.UnauthorizedException('You cannot add yourself as a member');
        if (team.members.includes(memberId))
            throw new common_1.UnauthorizedException('User already in team');
        if (team.ownerId === memberId)
            throw new common_1.UnauthorizedException('You cannot add the owner as a member');
        if (team.members.includes(ownerId))
            throw new common_1.UnauthorizedException('Owner already in team');
        if (team.ownerId !== ownerId) {
            console.log('Unauthorized: ownerId mismatch');
            throw new common_1.UnauthorizedException('Only the owner can add members to this team');
        }
        if (!Array.isArray(team.members)) {
            console.log('Members is not an array, initializing...');
            team.members = [];
        }
        if (team.members.includes(memberId)) {
            console.log('Member already in team');
            return;
        }
        team.members.push(memberId);
        console.log('Team members after:', team.members);
        await this.teamRepository.update(team);
        console.log('Team updated successfully');
        console.log('========================');
    }
    async removeMember(id, memberId, ownerId) {
        const team = await this.teamRepository.findById(id);
        if (!team)
            throw new common_1.NotFoundException(`Team with ID ${id} not found`);
        if (team.ownerId !== ownerId)
            throw new common_1.UnauthorizedException('Only the owner can remove members from this team');
        team.members = team.members.filter(memberId => memberId !== memberId);
        await this.teamRepository.update(team);
    }
    async getMembers(id) {
        const team = await this.teamRepository.findById(id);
        if (!team)
            throw new common_1.NotFoundException(`Team with ID ${id} not found`);
        return team.members;
    }
    async changeMemberRole(id, memberId, newRole, ownerId) {
        console.log('=== CHANGE MEMBER ROLE ===');
        console.log('Team ID:', id);
        console.log('Member ID:', memberId);
        console.log('New Role:', newRole);
        console.log('Owner ID:', ownerId);
        const team = await this.teamRepository.findById(id);
        if (!team)
            throw new common_1.NotFoundException(`Team with ID ${id} not found`);
        if (team.ownerId !== ownerId)
            throw new common_1.UnauthorizedException('Only the owner can change member roles');
        if (!team.members.includes(memberId)) {
            throw new common_1.NotFoundException('Member not found in team');
        }
        console.log(`Role change requested for member ${memberId} to ${newRole} - logged but not persisted`);
        team.updatedAt = new Date();
        await this.teamRepository.update(team);
        console.log('Member role change logged successfully');
        console.log('============================');
    }
    async getTeamWithMembers(id, userId) {
        const team = await this.teamRepository.findById(id);
        if (!team) {
            throw new common_1.NotFoundException('Team not found');
        }
        if (team.ownerId !== userId && !team.members.includes(userId)) {
            throw new common_1.UnauthorizedException('Access denied: Not a member of this team');
        }
        const memberDetails = await Promise.all(team.members.map(async (memberId) => {
            try {
                const user = await this.userService.findById(memberId);
                return {
                    id: memberId,
                    userId: memberId,
                    teamId: id,
                    role: 'member',
                    user: user ? {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt
                    } : null,
                    joinedAt: new Date().toISOString()
                };
            }
            catch (error) {
                console.error(`Error fetching user ${memberId}:`, error);
                return {
                    id: memberId,
                    userId: memberId,
                    teamId: id,
                    role: 'member',
                    user: null,
                    joinedAt: new Date().toISOString()
                };
            }
        }));
        return {
            id: team.id,
            name: team.name,
            ownerId: team.ownerId,
            members: memberDetails,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt
        };
    }
};
exports.TeamService = TeamService;
exports.TeamService = TeamService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_team_repository_1.FirebaseTeamRepository,
        user_service_1.UserService])
], TeamService);
//# sourceMappingURL=team.service.js.map