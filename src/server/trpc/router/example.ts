import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const exampleRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string(),
        createdByName: z.string(),
        createdById: z.string(),
        createdByImage: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const tweet = await ctx.prisma.tweet.create({
        data: {
          createdById: input.createdById,
          createdByImage: input.createdByImage,
          createdByName: input.createdByName,
          text: input.text,
        },
      });
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.tweet.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
});
