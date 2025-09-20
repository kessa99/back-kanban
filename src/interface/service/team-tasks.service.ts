import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class TeamTasksService {
  constructor(private readonly firestore: admin.firestore.Firestore) {}

  async getAssignedTasksByUserId(userId: string) {
    try {
      console.log('Getting assigned tasks for user:', userId);

      // 1. Récupérer toutes les équipes dont l'utilisateur est membre
      const teamsQuery = await this.firestore
        .collection('teams')
        .where('members', 'array-contains', userId)
        .get();

      if (teamsQuery.empty) {
        console.log('No teams found for user:', userId);
        return [];
      }

      const teamIds = teamsQuery.docs.map(doc => doc.id);
      console.log('User teams:', teamIds);

      // 2. Récupérer tous les boards de ces équipes
      const boardsQuery = await this.firestore
        .collection('boards')
        .where('teamId', 'in', teamIds)
        .get();

      if (boardsQuery.empty) {
        console.log('No boards found for teams:', teamIds);
        return [];
      }

      const boardIds = boardsQuery.docs.map(doc => doc.id);
      console.log('Team boards:', boardIds);

      // 3. Récupérer toutes les tâches assignées à l'utilisateur dans ces boards
      const tasksQuery = await this.firestore
        .collection('tasks')
        .where('boardId', 'in', boardIds)
        .where('assigneeId', '==', userId)
        .get();

      const tasks = tasksQuery.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        boardId: doc.data().boardId,
        boardName: this.getBoardName(boardsQuery.docs, doc.data().boardId),
        teamId: this.getTeamId(teamsQuery.docs, doc.data().boardId),
        teamName: this.getTeamName(teamsQuery.docs, doc.data().boardId)
      }));

      console.log('Found assigned tasks:', tasks.length);
      return tasks;
    } catch (error) {
      console.error('Error in getAssignedTasksByUserId:', error);
      throw error;
    }
  }

  async getAssignedBoardsByUserId(userId: string) {
    try {
      console.log('Getting assigned boards for user:', userId);

      // 1. Récupérer toutes les équipes dont l'utilisateur est membre
      const teamsQuery = await this.firestore
        .collection('teams')
        .where('members', 'array-contains', userId)
        .get();

      if (teamsQuery.empty) {
        console.log('No teams found for user:', userId);
        return [];
      }

      const teamIds = teamsQuery.docs.map(doc => doc.id);
      console.log('User teams:', teamIds);

      // 2. Récupérer tous les boards de ces équipes
      const boardsQuery = await this.firestore
        .collection('boards')
        .where('teamId', 'in', teamIds)
        .get();

      if (boardsQuery.empty) {
        console.log('No boards found for teams:', teamIds);
        return [];
      }

      // 3. Pour chaque board, compter les tâches assignées à l'utilisateur
      const boardsWithTaskCount = await Promise.all(
        boardsQuery.docs.map(async (boardDoc) => {
          const boardData = boardDoc.data();
          const boardId = boardDoc.id;

          // Compter les tâches assignées à l'utilisateur
          const tasksQuery = await this.firestore
            .collection('tasks')
            .where('boardId', '==', boardId)
            .where('assigneeId', '==', userId)
            .get();

          const assignedTasksCount = tasksQuery.size;

          // Récupérer la dernière activité (dernière tâche modifiée)
          const lastActivityQuery = await this.firestore
            .collection('tasks')
            .where('boardId', '==', boardId)
            .orderBy('updatedAt', 'desc')
            .limit(1)
            .get();

          const lastActivity = lastActivityQuery.empty 
            ? null 
            : lastActivityQuery.docs[0].data().updatedAt;

          return {
            id: boardId,
            name: boardData.name,
            description: boardData.description,
            teamId: boardData.teamId,
            teamName: this.getTeamName(teamsQuery.docs, boardData.teamId),
            assignedTasksCount,
            lastActivity,
            color: boardData.color || '#3B82F6'
          };
        })
      );

      // Filtrer les boards qui ont des tâches assignées
      const assignedBoards = boardsWithTaskCount.filter(board => board.assignedTasksCount > 0);

      console.log('Found assigned boards:', assignedBoards.length);
      return assignedBoards;
    } catch (error) {
      console.error('Error in getAssignedBoardsByUserId:', error);
      throw error;
    }
  }

  async getTasksByTeamId(teamId: string) {
    try {
      console.log('Getting tasks for team:', teamId);

      // 1. Vérifier que l'équipe existe
      const teamDoc = await this.firestore.collection('teams').doc(teamId).get();
      if (!teamDoc.exists) {
        throw new NotFoundException('Team not found');
      }

      // 2. Récupérer tous les boards de l'équipe
      const boardsQuery = await this.firestore
        .collection('boards')
        .where('teamId', '==', teamId)
        .get();

      if (boardsQuery.empty) {
        console.log('No boards found for team:', teamId);
        return [];
      }

      const boardIds = boardsQuery.docs.map(doc => doc.id);

      // 3. Récupérer toutes les tâches de ces boards
      const tasksQuery = await this.firestore
        .collection('tasks')
        .where('boardId', 'in', boardIds)
        .get();

      const tasks = tasksQuery.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        boardId: doc.data().boardId,
        boardName: this.getBoardName(boardsQuery.docs, doc.data().boardId)
      }));

      console.log('Found team tasks:', tasks.length);
      return tasks;
    } catch (error) {
      console.error('Error in getTasksByTeamId:', error);
      throw error;
    }
  }

  async getAssignedTasksForBoard(userId: string, boardId: string) {
    try {
      console.log('Getting assigned tasks for board:', boardId, 'user:', userId);

      // Récupérer les tâches assignées à l'utilisateur dans ce board
      const tasksQuery = await this.firestore
        .collection('tasks')
        .where('boardId', '==', boardId)
        .where('assigneeId', '==', userId)
        .get();

      const tasks = tasksQuery.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('Found assigned tasks for board:', tasks.length);
      return tasks;
    } catch (error) {
      console.error('Error in getAssignedTasksForBoard:', error);
      throw error;
    }
  }

  async getUserTeams(userId: string) {
    try {
      console.log('Getting teams for user:', userId);

      // Récupérer toutes les équipes dont l'utilisateur est membre
      const teamsQuery = await this.firestore
        .collection('teams')
        .where('members', 'array-contains', userId)
        .get();

      if (teamsQuery.empty) {
        console.log('No teams found for user:', userId);
        return [];
      }

      const userTeams = teamsQuery.docs.map(doc => {
        const teamData = doc.data();
        return {
          id: doc.id,
          name: teamData.name,
          description: teamData.description,
          role: teamData.members?.find((member: any) => member.userId === userId)?.role || 'member',
          createdAt: teamData.createdAt,
          updatedAt: teamData.updatedAt,
          memberCount: teamData.members?.length || 0
        };
      });

      console.log('Found user teams:', userTeams.length);
      return userTeams;
    } catch (error) {
      console.error('Error in getUserTeams:', error);
      throw error;
    }
  }

  async getBoardsAssignedByChecklist(userId: string) {
    try {
      console.log('Getting boards assigned by checklist for user:', userId);

      // 1. Récupérer toutes les checklists assignées à l'utilisateur
      const checklistsQuery = await this.firestore
        .collection('checklists')
        .where('assignedTo', '==', userId)
        .get();

      if (checklistsQuery.empty) {
        console.log('No checklists assigned to user:', userId);
        return [];
      }

      console.log('Found assigned checklists:', checklistsQuery.docs.length);

      // 2. Récupérer les IDs des tâches associées à ces checklists
      const taskIds = checklistsQuery.docs.map(doc => doc.data().taskId);
      console.log('Task IDs from checklists:', taskIds);

      if (taskIds.length === 0) {
        return [];
      }

      // 3. Récupérer les tâches correspondantes
      const tasksQuery = await this.firestore
        .collection('tasks')
        .where(admin.firestore.FieldPath.documentId(), 'in', taskIds)
        .get();

      if (tasksQuery.empty) {
        console.log('No tasks found for checklist assignments');
        return [];
      }

      console.log('Found tasks:', tasksQuery.docs.length);

      // 4. Récupérer les IDs des boards uniques
      const boardIds = [...new Set(tasksQuery.docs.map(doc => doc.data().boardId))];
      console.log('Unique board IDs:', boardIds);

      if (boardIds.length === 0) {
        return [];
      }

      // 5. Récupérer les boards correspondants
      const boardsQuery = await this.firestore
        .collection('boards')
        .where(admin.firestore.FieldPath.documentId(), 'in', boardIds)
        .get();

      if (boardsQuery.empty) {
        console.log('No boards found');
        return [];
      }

      // 6. Récupérer les équipes associées aux boards
      const teamIds = [...new Set(boardsQuery.docs.map(doc => doc.data().teamId))];
      const teamsQuery = await this.firestore
        .collection('teams')
        .where(admin.firestore.FieldPath.documentId(), 'in', teamIds)
        .get();

      const teamsMap = new Map();
      teamsQuery.docs.forEach(doc => {
        teamsMap.set(doc.id, { id: doc.id, ...doc.data() });
      });

      // 7. Construire la réponse avec les statistiques
      const assignedBoards = await Promise.all(
        boardsQuery.docs.map(async (boardDoc) => {
          const boardData = boardDoc.data();
          const boardId = boardDoc.id;
          const teamData = teamsMap.get(boardData.teamId);

          // Compter les checklists assignées à l'utilisateur dans ce board
          const boardTasks = tasksQuery.docs.filter(doc => doc.data().boardId === boardId);
          const boardTaskIds = boardTasks.map(doc => doc.id);
          
          const boardChecklistsQuery = await this.firestore
            .collection('checklists')
            .where('taskId', 'in', boardTaskIds)
            .where('assignedTo', '==', userId)
            .get();

          const assignedChecklistsCount = boardChecklistsQuery.size;

          // Récupérer la dernière activité (dernière checklist modifiée)
          const lastActivityQuery = await this.firestore
            .collection('checklists')
            .where('taskId', 'in', boardTaskIds)
            .where('assignedTo', '==', userId)
            .orderBy('updatedAt', 'desc')
            .limit(1)
            .get();

          const lastActivity = lastActivityQuery.empty 
            ? null 
            : lastActivityQuery.docs[0].data().updatedAt;

          return {
            id: boardId,
            name: boardData.name,
            description: boardData.description,
            teamId: boardData.teamId,
            teamName: teamData?.name || 'Unknown Team',
            assignedChecklistsCount,
            lastActivity,
            color: boardData.color || '#3B82F6',
            reason: 'assigned_by_checklist'
          };
        })
      );

      // Filtrer les boards qui ont des checklists assignées
      const filteredBoards = assignedBoards.filter(board => board.assignedChecklistsCount > 0);

      console.log('Found boards assigned by checklist:', filteredBoards.length);
      return filteredBoards;
    } catch (error) {
      console.error('Error in getBoardsAssignedByChecklist:', error);
      throw error;
    }
  }

  async getAssignedChecklists(userId: string) {
    try {
      console.log('Getting assigned checklists for user:', userId);

      // 1. Récupérer toutes les checklists assignées à l'utilisateur
      const checklistsQuery = await this.firestore
        .collection('checklists')
        .where('assignedTo', '==', userId)
        .get();

      if (checklistsQuery.empty) {
        console.log('No checklists assigned to user:', userId);
        return [];
      }

      console.log('Found assigned checklists:', checklistsQuery.docs.length);

      // 2. Récupérer les IDs des tâches associées
      const taskIds = checklistsQuery.docs.map(doc => doc.data().taskId);
      
      if (taskIds.length === 0) {
        return [];
      }

      // 3. Récupérer les tâches correspondantes
      const tasksQuery = await this.firestore
        .collection('tasks')
        .where(admin.firestore.FieldPath.documentId(), 'in', taskIds)
        .get();

      const tasksMap = new Map();
      tasksQuery.docs.forEach(doc => {
        tasksMap.set(doc.id, { id: doc.id, ...doc.data() });
      });

      // 4. Récupérer les boards correspondants
      const boardIds = [...new Set(tasksQuery.docs.map(doc => doc.data().boardId))];
      const boardsQuery = await this.firestore
        .collection('boards')
        .where(admin.firestore.FieldPath.documentId(), 'in', boardIds)
        .get();

      const boardsMap = new Map();
      boardsQuery.docs.forEach(doc => {
        boardsMap.set(doc.id, { id: doc.id, ...doc.data() });
      });

      // 5. Construire la réponse avec les informations enrichies
      const assignedChecklists = checklistsQuery.docs.map(doc => {
        const checklistData = doc.data();
        const taskData = tasksMap.get(checklistData.taskId);
        const boardData = boardsMap.get(taskData?.boardId);

        return {
          id: doc.id,
          title: checklistData.title,
          completed: checklistData.completed || false,
          assignedTo: checklistData.assignedTo,
          startDate: checklistData.startDate,
          endDate: checklistData.endDate,
          createdAt: checklistData.createdAt,
          updatedAt: checklistData.updatedAt,
          task: {
            id: taskData?.id,
            title: taskData?.title,
            description: taskData?.description,
            status: taskData?.status,
            priority: taskData?.priority,
            boardId: taskData?.boardId
          },
          board: {
            id: boardData?.id,
            name: boardData?.name,
            description: boardData?.description,
            teamId: boardData?.teamId
          }
        };
      });

      // Trier par date de mise à jour (plus récent en premier)
      assignedChecklists.sort((a, b) => {
        const dateA = a.updatedAt?.toDate?.() || new Date(a.updatedAt);
        const dateB = b.updatedAt?.toDate?.() || new Date(b.updatedAt);
        return dateB.getTime() - dateA.getTime();
      });

      console.log('Found assigned checklists with details:', assignedChecklists.length);
      return assignedChecklists;
    } catch (error) {
      console.error('Error in getAssignedChecklists:', error);
      throw error;
    }
  }

  async isUserMemberOfTeam(userId: string, teamId: string): Promise<boolean> {
    try {
      const teamDoc = await this.firestore.collection('teams').doc(teamId).get();
      if (!teamDoc.exists) {
        return false;
      }

      const teamData = teamDoc.data();
      const members = teamData?.members || [];
      
      return members.includes(userId);
    } catch (error) {
      console.error('Error checking team membership:', error);
      return false;
    }
  }

  private getBoardName(boardsDocs: any[], boardId: string): string {
    const boardDoc = boardsDocs.find(doc => doc.id === boardId);
    return boardDoc ? boardDoc.data().name : 'Unknown Board';
  }

  private getTeamId(teamsDocs: any[], boardId: string): string {
    // Cette méthode sera améliorée dans une version future
    // Pour l'instant, on retourne le premier teamId trouvé
    return teamsDocs.length > 0 ? teamsDocs[0].id : 'Unknown Team';
  }

  private getTeamName(teamsDocs: any[], teamId: string): string {
    const teamDoc = teamsDocs.find(doc => doc.id === teamId);
    return teamDoc ? teamDoc.data().name : 'Unknown Team';
  }
}
