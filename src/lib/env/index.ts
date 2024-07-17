import { z } from 'zod'

const schema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url(),
})

export const env = schema.parse(process.env)
