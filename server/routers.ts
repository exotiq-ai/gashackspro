import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { deleteTankHistory, getUserTankHistory, saveTankHistory, deleteUserAccount } from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
      // Delete user account and all associated data
      await deleteUserAccount(ctx.user.id);
      
      // Clear session cookie
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      
      return { success: true };
    }),
  }),

  tankHistory: router({
    save: protectedProcedure
      .input(
        z.object({
          vehicleMake: z.string().optional(),
          vehicleModel: z.string().optional(),
          tankSize: z.number(),
          currentTankLevel: z.number(),
          currentEmix: z.number(),
          targetEmix: z.number(),
          pumpGasEthanol: z.number(),
          pumpGasOctane: z.number(),
          ethanolFuelPercent: z.number(),
          ethanolFuelOctane: z.number(),
          ethanolToAdd: z.number(),
          pumpGasToAdd: z.number(),
          resultingMix: z.number(),
          resultingOctane: z.number(),
          ethanolPrice: z.number().optional(),
          pumpGasPrice: z.number().optional(),
          totalCost: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await saveTankHistory({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      const history = await getUserTankHistory(ctx.user.id);
      return history;
    }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteTankHistory(input.id, ctx.user.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
