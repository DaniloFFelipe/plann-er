import ky from 'ky'

import { env } from '../env'
import { localStorage } from '../storage/mmkv'

export const api = ky.create({
  prefixUrl: env.EXPO_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getString('token')
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    // afterResponse: [
    //   async (_, __, response) => {
    //     console.log(`RESPONSE: ${response.url}`)
    //     console.log(`STATUS::${response.status}`)
    //     console.log(`BODY: ${JSON.stringify(await response.json(), null, 2)}`)
    //   },
    // ],
  },
})
