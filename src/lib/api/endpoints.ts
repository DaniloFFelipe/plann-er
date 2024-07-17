export const Endpoints = {
  requestCode: () => 'users/sessions/code',
  auth: () => 'users/sessions/auth',
  updateName: () => 'users/name',

  createTrip: () => 'trips',
  myTrips: () => 'me/trips',
  myInvites: () => 'me/invites',
  getTrip: (tripId: string) => `trips/${tripId}`,
  getTripActivities: (tripId: string) => `trips/${tripId}/activities`,

  createActivities: (tripId: string) => `trips/${tripId}/activities`,
  createLink: (tripId: string) => `trips/${tripId}/links`,
  createInvite: (tripId: string) => `trips/${tripId}/invites`,
  acceptInvite: (inviteId: string) => `invite/${inviteId}/confirm`,
  rejectInvite: (inviteId: string) => `invite/${inviteId}/reject`,

  getTripInvites: (tripId: string) => `trips/${tripId}/invites`,
  getTripParticipants: (tripId: string) => `trips/${tripId}/participants`,
  getTripLinks: (tripId: string) => `trips/${tripId}/links`,
}
