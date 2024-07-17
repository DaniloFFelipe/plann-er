import { z } from 'zod'

export const createLinkDto = z.object({
  title: z.string().min(4),
  url: z.string().url(),
})
