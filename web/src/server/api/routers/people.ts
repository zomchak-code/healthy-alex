import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const peopleSchema = z.array(z.object({
  id: z.string(),
  display_name: z.string(),
  total_citations: z.number(),
  institutions: z.array(z.object({
    id: z.string(),
    display_name: z.string(),
  })),
}))

const personSchema = z.object({
  id: z.string(),
  display_name: z.string(),
  cited_by_count: z.number(),
  works_count: z.number(),
  last_known_institutions: z.array(z.object({
    id: z.string(),
    display_name: z.string(),
  })),
  works: z.array(z.object({
    id: z.string(),
    title: z.string(),
    publication_year: z.number(),
    cited_by_count: z.number(),
    authorships: z.array(z.object({
      author: z.object({
        id: z.string(),
        display_name: z.string(),
      }),
    })),
  })),
})

const contactSchema = z.array(z.object({
  email: z.string(),
  name: z.string(),
  university: z.string(),
}))

export const peopleRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ type: z.string(), id: z.string() }))
    .query(async ({ input }) => {
      const res = await fetch(`${process.env.PUBLIC_BACKEND_URL}/people/list/${input.type}/${input.id}`)
      return peopleSchema.parse(await res.json());
    }),
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const res = await fetch(`${process.env.PUBLIC_BACKEND_URL}/people/${input.id}`)
      return personSchema.parse(await res.json());
    }),
  findContacts: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const res = await fetch(`${process.env.PUBLIC_BACKEND_URL}/people/contacts/${input.name}`);
      return contactSchema.parse(await res.json());
    }),
});
