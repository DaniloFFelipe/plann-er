import { z } from 'zod'

export const createTripDto = z.object({
  destination: z.string().min(4),
  starts_at: z.coerce.date(),
  ends_at: z.coerce.date(),
  emails_to_invite: z.array(z.string().email()),
})
