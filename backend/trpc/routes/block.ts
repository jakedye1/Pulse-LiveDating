import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";

// Mock database for blocked users
// In a real app, this would be a database table
const blockedUsers: { blockerId: string; blockedId: string; createdAt: Date }[] = [];

export const blockRouter = createTRPCRouter({
  block: publicProcedure
    .input(z.object({ blockedUserId: z.string(), blockerUserId: z.string() })) // passing blockerUserId for demo purposes since we don't have auth context middleware yet
    .mutation(({ input }) => {
      const exists = blockedUsers.find(
        (b) => b.blockerId === input.blockerUserId && b.blockedId === input.blockedUserId
      );

      if (!exists) {
        blockedUsers.push({
          blockerId: input.blockerUserId,
          blockedId: input.blockedUserId,
          createdAt: new Date(),
        });
      }
      
      return { success: true };
    }),

  unblock: publicProcedure
    .input(z.object({ blockedUserId: z.string(), blockerUserId: z.string() }))
    .mutation(({ input }) => {
      const index = blockedUsers.findIndex(
        (b) => b.blockerId === input.blockerUserId && b.blockedId === input.blockedUserId
      );

      if (index !== -1) {
        blockedUsers.splice(index, 1);
      }

      return { success: true };
    }),

  getBlockedUsers: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return blockedUsers
        .filter((b) => b.blockerId === input.userId)
        .map((b) => b.blockedId);
    }),
});
