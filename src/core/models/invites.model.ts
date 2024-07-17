export interface Invite {
  id: string
  email: string
  trip_id: string

  trip: {
    destination: string
    starts_at: Date
    ends_at: Date
  }
}
