import { apiClient } from './api';

export interface GroupListResponse {
  id: string;
  name: string;
  subject: string;
  members: number;
  maxMembers: number;
  activeChallenges: number;
  color: string;
}

export interface GroupMemberResponse {
  userId: string;
  username: string;
  role: string;
  level: number;
  streak: number;
  xp: number;
}

export interface GroupDetailsResponse {
  id: string;
  name: string;
  description: string;
  subject: string;
  maxMembers: number;
  activeChallenges: number;
  totalXp: number;
  color: string;
  members: GroupMemberResponse[];
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  subject: string;
  maxMembers: number;
}

export const groupService = {
  async getGroups(): Promise<GroupListResponse[]> {
    try {
      const response = await apiClient.get<GroupListResponse[]>('/social/groups');
      return response as any;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  },

  async getGroupDetails(id: string): Promise<GroupDetailsResponse> {
    try {
      const response = await apiClient.get<GroupDetailsResponse>(`/social/groups/${id}`);
      return response as any;
    } catch (error) {
      console.error('Error fetching group details:', error);
      throw error;
    }
  },

  async createGroup(data: CreateGroupRequest): Promise<GroupListResponse> {
    try {
      const response = await apiClient.post<GroupListResponse>('/social/groups', data);
      return response as any;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  async addMember(groupId: string, identifier: string): Promise<{ status: string, message: string }> {
    try {
      const response = await apiClient.post<{ status: string, message: string }>(`/social/groups/${groupId}/members`, { identifier });
      return response as any;
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  }
};
