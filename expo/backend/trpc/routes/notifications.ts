import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";

// Mock data for notifications
export interface Notification {
  id: string;
  userId: string;
  type: 'match' | 'message' | 'friend_request' | 'group_invite' | 'live_video_invite' | 'system';
  title: string;
  body: string;
  targetId?: string;
  isRead: boolean;
  createdAt: string; // ISO string
}

let notifications: Notification[] = [
  {
    id: '1',
    userId: 'current-user',
    type: 'match',
    title: 'New Match!',
    body: 'You matched with Sarah. Say hi!',
    targetId: '1', // user id
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: '2',
    userId: 'current-user',
    type: 'message',
    title: 'New Message',
    body: 'Emma sent you a message.',
    targetId: '1', // conversation/user id
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: '3',
    userId: 'current-user',
    type: 'system',
    title: 'Welcome to Pulse',
    body: 'Thanks for joining! Complete your profile to get more matches.',
    targetId: 'profile',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: '4',
    userId: 'current-user',
    type: 'friend_request',
    title: 'Friend Request',
    body: 'Alex wants to be friends.',
    targetId: '1', // friend id
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: '5',
    userId: 'current-user',
    type: 'live_video_invite',
    title: 'Live Invite',
    body: 'Jordan invited you to join their live video.',
    targetId: 'room-123',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
  }
];

export const notificationsRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(() => {
      // Sort by newest first
      return notifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }),

  markAsRead: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const notification = notifications.find(n => n.id === input.id);
      if (notification) {
        notification.isRead = true;
      }
      return { success: true };
    }),

  markAllAsRead: publicProcedure
    .mutation(() => {
      notifications.forEach(n => n.isRead = true);
      return { success: true };
    }),
    
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      notifications = notifications.filter(n => n.id !== input.id);
      return { success: true };
    }),
});
