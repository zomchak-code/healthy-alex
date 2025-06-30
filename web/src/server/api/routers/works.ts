import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const workSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  primary_location: z.object({
    landing_page_url: z.string(),
  }),
  publication_date: z.string(),
  cited_by_count: z.number(),
  authorships: z.array(z.object({
    author: z.object({
      id: z.string(),
      display_name: z.string(),
    }),
    institutions: z.array(z.object({
      id: z.string(),
      display_name: z.string(),
    })),
  })),
})

export const worksRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const res = await fetch(`${process.env.PUBLIC_BACKEND_URL}/works/${input.id}`)
      return workSchema.parse(await res.json());
    }),
});
