export type UserRole = 'child' | 'parent' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
}

export interface ChildProfile {
  id: string
  user_id: string
  display_name: string
  avatar_url: string | null
  age: number
  current_level_id: string
  total_xp: number
  created_at: string
}

export interface Level {
  id: string
  number: number
  title: string
  description: string
  required_xp: number
  badge_id: string | null
}

export type MissionDifficulty = 'easy' | 'medium' | 'hard'
export type MissionType = 'blockly' | 'quiz' | 'challenge'

export interface Mission {
  id: string
  level_id: string
  title: string
  description: string
  type: MissionType
  difficulty: MissionDifficulty
  xp_reward: number
  order_index: number
  instructions: string
  starter_code: string | null
  solution_code: string | null
  // Translated content columns
  title_es: string | null
  title_en: string | null
  story_es: string | null
  story_en: string | null
  objective_es: string | null
  objective_en: string | null
  concept_es: string | null
  concept_en: string | null
  hints_es: string[] | null
  hints_en: string[] | null
}

export type MissionStatus = 'locked' | 'available' | 'in_progress' | 'completed'

export interface MissionProgress {
  id: string
  child_profile_id: string
  mission_id: string
  status: MissionStatus
  attempts: number
  completed_at: string | null
  code_snapshot: string | null
}

export interface Badge {
  id: string
  name: string
  description: string
  image_url: string
  condition_type: string
  condition_value: number
}

export type ProjectStatus = 'draft' | 'published'

export interface Project {
  id: string
  child_profile_id: string
  title: string
  description: string | null
  code: string
  status: ProjectStatus
  thumbnail_url: string | null
  created_at: string
  updated_at: string
}
