export interface Activity {
  id: string
  title: string
  occurs_at: string
  trip_id: string
}

export interface ActivitySection {
  date: string
  activities: Activity[]
}
