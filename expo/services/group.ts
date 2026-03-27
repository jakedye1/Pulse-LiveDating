import { ServiceResponse, Group } from '@/domain/types';

const MOCK_GROUPS: Group[] = [
  {
    id: 'group_1',
    name: 'Late Night Talks',
    members_count: 124,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=400&fit=crop',
    created_at: new Date().toISOString(),
    creator_id: 'creator_1',
    description: 'A place for night owls to chat.',
  },
  {
    id: 'group_2',
    name: 'Music Lovers',
    members_count: 89,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    created_at: new Date().toISOString(),
    creator_id: 'creator_2',
  },
  {
    id: 'group_3',
    name: 'Gaming Squad',
    members_count: 56,
    is_active: false,
    image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop',
    created_at: new Date().toISOString(),
    creator_id: 'creator_3',
  },
];

export interface GroupServiceInterface {
  listGroups(filter?: any): Promise<ServiceResponse<Group[]>>;
  joinGroup(groupId: string): Promise<ServiceResponse<void>>;
  leaveGroup(groupId: string): Promise<ServiceResponse<void>>;
  createGroup(name: string, description: string): Promise<ServiceResponse<Group>>;
}

export const GroupService: GroupServiceInterface = {
  async listGroups(filter?: any): Promise<ServiceResponse<Group[]>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: MOCK_GROUPS, error: null };
  },

  async joinGroup(groupId: string): Promise<ServiceResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: null, error: null };
  },

  async leaveGroup(groupId: string): Promise<ServiceResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: null, error: null };
  },

  async createGroup(name: string, description: string): Promise<ServiceResponse<Group>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newGroup: Group = {
      id: `group_${Date.now()}`,
      name,
      description,
      members_count: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      creator_id: 'me',
    };
    return { data: newGroup, error: null };
  }
};
