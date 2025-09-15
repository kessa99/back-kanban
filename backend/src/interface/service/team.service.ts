import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TeamEntity } from 'src/domain/entities/userTeam/userTeam.team.entity';
import { FirebaseTeamRepository } from 'src/infrastructure/repositories/firebase-team.repository';
import { CreateTeamDto } from 'src/utils/dto/team/create-team.dto';
import { UpdateTeamDto } from 'src/utils/dto/team/update-team.dto';
import { UserService } from './user.service';

@Injectable()
export class TeamService {
    constructor(
        private readonly teamRepository: FirebaseTeamRepository, // Injection directe
        private readonly userService: UserService
    ) {}

    async createTeam(createTeamDto: CreateTeamDto, ownerId: string): Promise<TeamEntity> {
        const team = TeamEntity.create({
            id: '',
            name: createTeamDto.name,
            ownerId: ownerId, // L'utilisateur devient automatiquement le propriétaire
            members: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        
        return this.teamRepository.create(team);
    }
    
    async findById(id: string, userId: string): Promise<any> {
        const team = await this.teamRepository.findById(id);
        if (!team) {
            throw new NotFoundException('Team not found');
        }
        
        console.log('DEBUG TeamService.findById:', {
            teamId: id,
            userId,
            teamOwnerId: team.ownerId,
            teamMembers: team.members,
            isOwner: team.ownerId === userId,
            isMember: team.members.includes(userId)
        });
        
        // Vérifier que l'utilisateur est le propriétaire OU un membre de l'équipe
        if (team.ownerId !== userId && !team.members.includes(userId)) {
            console.log('DEBUG: User not authorized, returning null');
            return null;
        }
        
        // Récupérer les détails des membres
        const memberDetails = await Promise.all(
            team.members.map(async (memberId) => {
                try {
                    const user = await this.userService.findUserById(memberId); // Corriger ici
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
                } catch (error) {
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
            })
        );
        
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

    async findAll(userId: string): Promise<any[]> {
        const teams = await this.teamRepository.findByOwnerId(userId);
        
        // Pour chaque équipe, récupérer les détails des membres
        const teamsWithMembers = await Promise.all(
            teams.map(async (team) => {
                const memberDetails = await Promise.all(
                    team.members.map(async (memberId) => {
                        try {
                            const user = await this.userService.findUserById(memberId); // Corriger ici
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
                        } catch (error) {
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
                    })
                );
                
                return {
                    id: team.id,
                    name: team.name,
                    ownerId: team.ownerId,
                    members: memberDetails,
                    createdAt: team.createdAt,
                    updatedAt: team.updatedAt
                };
            })
        );
        
        return teamsWithMembers;
    }

    // get team members
    async getTeamMembers(id: string, ownerId: string): Promise<string[]> {
        const team = await this.teamRepository.findById(id);
        if (!team) throw new NotFoundException(`Team with ID ${id} not found`);
        
        // Vérifier que l'utilisateur est le propriétaire ou un membre
        if (team.ownerId !== ownerId && !team.members.includes(ownerId)) {
            throw new UnauthorizedException('Access denied: Not a member of this team');
        }
        
        return team.members;
    }
    
    async update(id: string, updates: Partial<TeamEntity>, ownerId: string): Promise<TeamEntity> {
        const team = await this.teamRepository.findById(id);
        if (!team) throw new NotFoundException(`Team with ID ${id} not found`);
        if (team.ownerId !== ownerId) throw new UnauthorizedException('Only the owner can update this team');
        const updatedTeam = { ...team, ...updates, updatedAt: new Date() };
        return this.teamRepository.update(updatedTeam);
    }

    async delete(id: string, ownerId: string): Promise<void> {
        const team = await this.teamRepository.findById(id);
        if (!team) throw new NotFoundException(`Team with ID ${id} not found`);
        if (team.ownerId !== ownerId) throw new UnauthorizedException('Only the owner can delete this team');
        await this.teamRepository.delete(id);
    }

    async addMember(id: string, memberId: string, ownerId: string): Promise<void> {
        console.log('=== ADD MEMBER DEBUG ===');
        console.log('Team ID:', id);
        console.log('Member ID:', memberId);
        console.log('Owner ID:', ownerId);
        
        const team = await this.teamRepository.findById(id);
        if (!team) throw new NotFoundException(`Team with ID ${id} not found`);
        
        console.log('Team found:', team);
        console.log('Team members before:', team.members);
        console.log('Team ownerId:', team.ownerId);
        
        if (team.ownerId !== ownerId) {
            console.log('Unauthorized: ownerId mismatch');
            throw new UnauthorizedException('Only the owner can add members to this team');
        }
        
        // S'assurer que members est un tableau
        if (!Array.isArray(team.members)) {
            console.log('Members is not an array, initializing...');
            team.members = [];
        }
        
        // Vérifier si le membre n'est pas déjà dans l'équipe
        if (team.members.includes(memberId)) {
            console.log('Member already in team');
            return; // Membre déjà dans l'équipe, pas d'erreur
        }
        
        team.members.push(memberId);
        console.log('Team members after:', team.members);
        
        await this.teamRepository.update(team);
        console.log('Team updated successfully');
        console.log('========================');
    }
    
    async removeMember(id: string, memberId: string, ownerId: string): Promise<void> {
        const team = await this.teamRepository.findById(id);
        if (!team) throw new NotFoundException(`Team with ID ${id} not found`);
        if (team.ownerId !== ownerId) throw new UnauthorizedException('Only the owner can remove members from this team');
        team.members = team.members.filter(memberId => memberId !== memberId);
        await this.teamRepository.update(team);
    }

    async getMembers(id: string): Promise<string[]> {
        const team = await this.teamRepository.findById(id);
        if (!team) throw new NotFoundException(`Team with ID ${id} not found`);
        return team.members;
    }
    
    async changeMemberRole(id: string, memberId: string, newRole: 'admin' | 'member' | 'viewer', ownerId: string): Promise<void> {
        console.log('=== CHANGE MEMBER ROLE ===');
        console.log('Team ID:', id);
        console.log('Member ID:', memberId);
        console.log('New Role:', newRole);
        console.log('Owner ID:', ownerId);
        
        const team = await this.teamRepository.findById(id);
        if (!team) throw new NotFoundException(`Team with ID ${id} not found`);
        if (team.ownerId !== ownerId) throw new UnauthorizedException('Only the owner can change member roles');
        
        // Vérifier que le membre existe dans l'équipe
        if (!team.members.includes(memberId)) {
            throw new NotFoundException('Member not found in team');
        }
        
        // Note: Avec string[] pour members, on ne peut pas stocker les rôles
        // Cette fonctionnalité nécessiterait TeamMember[] pour stocker les rôles
        console.log(`Role change requested for member ${memberId} to ${newRole} - logged but not persisted`);
        team.updatedAt = new Date();
        
        await this.teamRepository.update(team);
        console.log('Member role change logged successfully');
        console.log('============================');
    }
    
    async getTeamWithMembers(id: string, userId: string): Promise<any> {
        const team = await this.teamRepository.findById(id);
        if (!team) {
            throw new NotFoundException('Team not found');
        }
        
        // Vérifier que l'utilisateur est le propriétaire OU un membre de l'équipe
        if (team.ownerId !== userId && !team.members.includes(userId)) {
            throw new UnauthorizedException('Access denied: Not a member of this team');
        }
        
        // Récupérer les détails des membres
        const memberDetails = await Promise.all(
            team.members.map(async (memberId) => {
                try {
                    const user = await this.userService.findById(memberId);
                    return {
                        id: memberId,
                        userId: memberId,
                        teamId: id,
                        role: 'member', // Par défaut, vous pouvez stocker le rôle dans l'équipe
                        user: user ? {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt
                        } : null,
                        joinedAt: new Date().toISOString() // Vous pouvez stocker cette info lors de l'ajout
                    };
                } catch (error) {
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
            })
        );
        
        return {
            id: team.id,
            name: team.name,
            ownerId: team.ownerId,
            members: memberDetails,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt
        };
    }
    
}
