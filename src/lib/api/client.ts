import { z } from 'zod'

import { createActivityDto } from '@/core/dto/create-activity.dto'
import { createLinkDto } from '@/core/dto/create-link.dto'
import { createTripDto } from '@/core/dto/create-trip.dto'
import { ActivitySection } from '@/core/models/activity.model'
import { Invite } from '@/core/models/invites.model'
import { Link } from '@/core/models/links.model'
import { Member } from '@/core/models/member.model'
import { Trip } from '@/core/models/trip.model'

import { api } from './api'
import { Endpoints } from './endpoints'

export const ApiClient = {
  async requestCode(email: string) {
    const data = await api
      .post(Endpoints.requestCode(), {
        json: { email },
      })
      .then((r) => r.json<{ token: string }>())

    return data
  },

  async authenticate(token: string, code: string) {
    const data = await api
      .post(Endpoints.auth(), {
        json: { token, code },
      })
      .then((r) => r.json<{ token: string; hasToUpdateName: boolean }>())

    return data
  },

  async updateName(name: string) {
    const data = await api.patch(Endpoints.updateName(), {
      json: { name },
    })
    return data
  },

  async getTrip(tripId: string) {
    const data = await api
      .get(Endpoints.getTrip(tripId))
      .then((r) => r.json<{ trip: Trip }>())

    return data.trip
  },

  async getTripActivities(tripId: string) {
    const data = await api
      .get(Endpoints.getTripActivities(tripId))
      .then((r) => r.json<{ activities: ActivitySection[] }>())

    return data.activities
  },

  async createActivities({
    tripId,
    ...data
  }: z.infer<typeof createActivityDto>) {
    await api.post(Endpoints.createActivities(tripId), {
      json: data,
    })
  },

  async createLink(tripId: string, data: z.infer<typeof createLinkDto>) {
    await api.post(Endpoints.createLink(tripId), {
      json: data,
    })
  },

  async createInvite(tripId: string, email: string) {
    await api.post(Endpoints.createInvite(tripId), {
      json: { email },
    })
  },

  async getMyTrips() {
    const data = await api
      .get(Endpoints.myTrips())
      .then((r) => r.json<{ trips: Trip[] }>())

    return data.trips
  },

  async getMyInvites() {
    const data = await api
      .get(Endpoints.myInvites())
      .then((r) => r.json<{ invites: Invite[] }>())

    return data.invites
  },

  async createTrips(data: z.infer<typeof createTripDto>) {
    return await api
      .post(Endpoints.createTrip(), {
        json: data,
      })
      .then((r) => r.json<{ tripId: string }>())
  },

  async getTripLinks(tripId: string) {
    const data = await api
      .get(Endpoints.getTripLinks(tripId))
      .then((r) => r.json<{ links: Link[] }>())

    return data.links
  },

  async getTripMembers(tripId: string) {
    const [{ invites }, { participants }] = await Promise.all([
      api
        .get(Endpoints.getTripInvites(tripId))
        .then((r) => r.json<{ invites: { id: string; email: string }[] }>()),
      api.get(Endpoints.getTripParticipants(tripId)).then((r) =>
        r.json<{
          participants: {
            user: {
              name: string | null
              id: string
              email: string
            }
            id: string
          }[]
        }>(),
      ),
    ])

    const pendingMembers: Member[] = invites.map((i) => {
      return {
        id: i.id + '-invite',
        email: i.email,
        isConfirmed: false,
      }
    })

    const confirmedMembers: Member[] = participants.map((i) => {
      return {
        id: i.id + '-participant',
        email: i.user.email,
        name: i.user.name ?? undefined,
        isConfirmed: true,
      }
    })

    return confirmedMembers.concat(pendingMembers)
  },

  async getTripInfo(tripId: string) {
    const [links, members] = await Promise.all([
      ApiClient.getTripLinks(tripId),
      ApiClient.getTripMembers(tripId),
    ])

    return {
      links,
      members,
    }
  },

  async acceptInvite(inviteId: string) {
    await api.post(Endpoints.acceptInvite(inviteId))
  },

  async rejectInvite(inviteId: string) {
    await api.post(Endpoints.rejectInvite(inviteId))
  },
}
