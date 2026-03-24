export interface Analysis {
  tags: string[]
  summary: string
  emotions: {
    primary: string
    secondary?: string
    intensity: number
  }
}

export interface Diary {
  id: string
  user_id: string
  content: string
  mood_score: number
  analysis?: Analysis
  created_at: string
}

export interface SimilarDiary extends Diary {
  similarity: number
}

export interface PushSubscriptionData {
  endpoint: string
  p256dh: string
  auth: string
}
