import { router } from "../trpc";
import { authRouter } from "./auth";
import { tweetsRouter } from "./tweets";

export const appRouter = router({
  tweets: tweetsRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
