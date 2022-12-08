import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const tweetsRouter = router({
  createTweet: publicProcedure
    .input(
      z.object({
        createdByName: z.string(),
        createdById: z.string(),
        createdByImage: z.string(),
        text: z.string().max(256).min(1),
      })
    )
    .mutation(({ input, ctx }) => {
      ctx.prisma.tweet.create({
        data: {
          ...input,
        },
      });
    }),
  getTweets: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input, ctx }) => {
      const tweets = ctx.prisma.tweet.findMany({
        where: {
          createdById: input.userId,
        },
      });
      return tweets;
    }),
});
