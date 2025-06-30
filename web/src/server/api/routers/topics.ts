import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


const itemSchema = z.object({
  id: z.string(),
  display_name: z.string(),
})

const domainSchema = z.object({
  fields: z.array(itemSchema),
})

const fieldSchema = z.object({
  domain: itemSchema,
  subfields: z.array(itemSchema),
})

const subfieldSchema = z.object({
  field: itemSchema,
  topics: z.array(itemSchema),
})

export const topicsRouter = createTRPCRouter({
  getDomain: publicProcedure.query(async () => {
    // time the request
    const start_time = performance.now()

    const res = await fetch(`${process.env.PUBLIC_BACKEND_URL}/domains`)
    const domain = domainSchema.parse(await res.json())

    const end_time = performance.now()
    console.log(`getDomain: ${end_time - start_time} milliseconds`)

    return domain
  }),

  getField: publicProcedure.input(z.string()).query(async ({ input }) => {
    const res = await fetch(`${process.env.PUBLIC_BACKEND_URL}/fields/${input}`)
    return fieldSchema.parse(await res.json())
  }),

  getSubfield: publicProcedure.input(z.string()).query(async ({ input }) => {
    const res = await fetch(`${process.env.PUBLIC_BACKEND_URL}/subfields/${input}`)
    return subfieldSchema.parse(await res.json())
  }),
});
