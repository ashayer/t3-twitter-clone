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
    .mutation(async ({ input, ctx }) => {
      console.log(ctx);
      console.log(input);
      const tweet = await ctx.prisma.tweet.create({
        data: {
          createdById: input.createdById,
          createdByImage: input.createdByImage,
          createdByName: input.createdByName,
          text: input.text,
        },
      });
      console.log(tweet);
    }),
  getTweets: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const tweets = await ctx.prisma.tweet.findMany({
        where: {
          createdById: input.userId,
        },
      });
      return tweets;
    }),
});
