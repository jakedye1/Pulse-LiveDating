import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";

// Mock data for dating preferences
// In a real app, this would be in a database
let userPreferences = {
  userId: 'current-user',
  interestedIn: ['Women'] as string[],
  ageRange: { min: 18, max: 35 },
  distance: 25, // miles
  appearInDating: true,
  showWithPhotosOnly: true,
  showVerifiedOnly: false,
  religionFilterEnabled: false,
  religionPreferences: [] as string[],
};

export const preferencesRouter = createTRPCRouter({
  get: publicProcedure
    .query(() => {
      return userPreferences;
    }),

  update: publicProcedure
    .input(z.object({
      interestedIn: z.array(z.string()),
      ageRange: z.object({
        min: z.number(),
        max: z.number(),
      }),
      distance: z.number(),
      appearInDating: z.boolean(),
      showWithPhotosOnly: z.boolean(),
      showVerifiedOnly: z.boolean(),
      religionFilterEnabled: z.boolean().optional(),
      religionPreferences: z.array(z.string()).optional(),
    }))
    .mutation(({ input }) => {
      userPreferences = {
        ...userPreferences,
        ...input,
        // Ensure we preserve existing values if they are undefined in input (though zod handles this if we make them optional in input and merge)
        // Since I made them optional in input, I should be careful. 
        // Actually, let's just make them required in the input schema if they are part of the state, 
        // or handle the merge correctly. The current implementation does ...input.
      };
      return { success: true, preferences: userPreferences };
    }),
});
