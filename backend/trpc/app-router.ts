import { createTRPCRouter } from "./create-context";
import { blockRouter } from "./routes/block";
import { notificationsRouter } from "./routes/notifications";
import { preferencesRouter } from "./routes/preferences";
import { limitsRouter } from "./routes/limits";

export const appRouter = createTRPCRouter({
  block: blockRouter,
  notifications: notificationsRouter,
  preferences: preferencesRouter,
  limits: limitsRouter,
});

export type AppRouter = typeof appRouter;
