import { z } from 'zod'

export const createActivityDto = z.object({
  tripId: z.string(),
  title: z.string().min(4),
  occurs_at: z.date(),
})
