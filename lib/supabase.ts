import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserPlan = 'basic' | 'premium'
export type Gender = 'male' | 'female'
export type Frequency = 'F3' | 'F4'

export interface UserProfile {
  id: string
  email: string
  name: string
  plan: UserPlan
  gender: Gender
  frequency: Frequency
  avatar_config: AvatarConfig | null
  created_at: string
}

export interface AvatarConfig {
  skin: string
  hair: string
  hair_color: string
  body: string
  outfit: string
  name: string
}
