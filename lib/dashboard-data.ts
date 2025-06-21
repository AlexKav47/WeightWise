export type ChallengeProgress = {
  name: string
  progress: number
}

export type DashboardData = {
  totalPoints: number
  challengesCompleted: number
  coursesCompleted: number
  weeklyChallengeProgress: ChallengeProgress[]
}

/**
 * Fetch a user’s dashboard stats from your backend.
 * Replace the mock implementation with a real call once an API is ready.
 */
export async function getDashboardData(userId: string): Promise<DashboardData> {
  // TODO: replace with real request (e.g. Supabase / REST / GraphQL)
  // For now we return empty data so the UI renders without errors.
  return {
    totalPoints: 0,
    challengesCompleted: 0,
    coursesCompleted: 0,
    weeklyChallengeProgress: [],
  }
}
