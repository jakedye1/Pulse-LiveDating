import { createTRPCRouter, publicProcedure } from "../create-context";

// Mock database for limits
interface UserLimitData {
  dailyFreeLiveCallsUsed: number;
  extraLiveCallsRemaining: number;
  dailyMatchesCreated: number;
  lastResetDate: string; // YYYY-MM-DD
}

const userLimits: Record<string, UserLimitData> = {};

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const getUserLimits = (userId: string): UserLimitData => {
  const today = getTodayDateString();
  
  if (!userLimits[userId]) {
    userLimits[userId] = {
      dailyFreeLiveCallsUsed: 0,
      extraLiveCallsRemaining: 0,
      dailyMatchesCreated: 0,
      lastResetDate: today,
    };
  }

  // Check for reset
  if (userLimits[userId].lastResetDate !== today) {
    userLimits[userId].dailyFreeLiveCallsUsed = 0;
    userLimits[userId].dailyMatchesCreated = 0;
    // extraLiveCallsRemaining is NOT reset
    userLimits[userId].lastResetDate = today;
  }

  return userLimits[userId];
};

export const limitsRouter = createTRPCRouter({
  getLimits: publicProcedure
    .query(({ ctx }) => {
      // In a real app, get userId from ctx.user (if auth middleware existed)
      // For now, assume a fixed user or pass userId in input. 
      // But looking at other routers, they might not be using auth context yet or mocking it.
      // I'll assume a default user "current-user" matching preferences router.
      const userId = "current-user";
      return getUserLimits(userId);
    }),

  checkLiveCallLimit: publicProcedure
    .query(({ ctx }) => {
      const userId = "current-user";
      const limits = getUserLimits(userId);
      
      const freeLimit = 5;
      const hasFreeCalls = limits.dailyFreeLiveCallsUsed < freeLimit;
      const hasExtraCalls = limits.extraLiveCallsRemaining > 0;
      
      const allowed = hasFreeCalls || hasExtraCalls;
      
      return {
        allowed,
        reason: allowed ? null : 'limit_reached',
        dailyUsed: limits.dailyFreeLiveCallsUsed,
        dailyLimit: freeLimit,
        extraRemaining: limits.extraLiveCallsRemaining,
      };
    }),

  recordLiveCall: publicProcedure
    .mutation(({ ctx }) => {
      const userId = "current-user";
      const limits = getUserLimits(userId);
      const freeLimit = 5;

      if (limits.dailyFreeLiveCallsUsed < freeLimit) {
        limits.dailyFreeLiveCallsUsed++;
      } else if (limits.extraLiveCallsRemaining > 0) {
        limits.extraLiveCallsRemaining--;
      } else {
        // Should strictly not happen if checked before
        throw new Error("Limit reached");
      }
      
      return { success: true, limits };
    }),

  purchaseExtraCalls: publicProcedure
    .mutation(({ ctx }) => {
      const userId = "current-user";
      const limits = getUserLimits(userId);
      
      limits.extraLiveCallsRemaining += 5;
      
      return { success: true, newTotal: limits.extraLiveCallsRemaining };
    }),

  checkMatchLimit: publicProcedure
    .query(({ ctx }) => {
      const userId = "current-user";
      const limits = getUserLimits(userId);
      const matchLimit = 7;
      
      return {
        allowed: limits.dailyMatchesCreated < matchLimit,
        dailyUsed: limits.dailyMatchesCreated,
        dailyLimit: matchLimit,
      };
    }),

  recordMatch: publicProcedure
    .mutation(({ ctx }) => {
      const userId = "current-user";
      const limits = getUserLimits(userId);
      
      limits.dailyMatchesCreated++;
      
      return { success: true, limits };
    }),
});
