'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

type ProgressStatus = 'started' | 'completed' | 'completed_extra'

// ── saveMissionProgress ───────────────────────────────────────────────────────
// missionId is the slug string (e.g. 'primeros-pasos-01').
// Looks up the DB UUID by slug; fails silently if missions table not yet seeded.

export async function saveMissionProgress(
  childProfileId: string,
  missionId: string,
  status: ProgressStatus,
  attempts: number,
  hintsUsed: number
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  // Verify ownership
  const { data: child } = await supabase
    .from('child_profiles')
    .select('id')
    .eq('id', childProfileId)
    .eq('user_id', user.id)
    .single()
  if (!child) return { error: 'Perfil no encontrado' }

  // Look up mission UUID by slug
  const { data: mission } = await supabase
    .from('missions')
    .select('id')
    .eq('slug', missionId)
    .single()
  if (!mission) return {} // missions table not yet seeded — fail silently

  const now = new Date().toISOString()
  const isCompleted = status === 'completed' || status === 'completed_extra'

  const { error } = await supabase.from('mission_progress').upsert(
    {
      child_profile_id: childProfileId,
      mission_id: mission.id,
      status,
      attempts,
      hints_used: hintsUsed,
      started_at: now,
      ...(isCompleted ? { completed_at: now } : {}),
    },
    { onConflict: 'child_profile_id,mission_id' }
  )

  if (error) return { error: 'No se pudo guardar el progreso.' }
  return {}
}

// ── getMissionProgress ────────────────────────────────────────────────────────

export interface MissionProgressRow {
  id: string
  status: string
  attempts: number
  hints_used: number
  completed_at: string | null
  missions: { title: string; concept: string } | null
}

export async function getMissionProgress(
  childProfileId: string
): Promise<MissionProgressRow[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data: child } = await supabase
    .from('child_profiles')
    .select('id')
    .eq('id', childProfileId)
    .eq('user_id', user.id)
    .single()
  if (!child) return []

  const { data } = await supabase
    .from('mission_progress')
    .select(
      `
      id,
      status,
      attempts,
      hints_used,
      completed_at,
      missions ( title, concept )
    `
    )
    .eq('child_profile_id', childProfileId)
    .in('status', ['completed', 'completed_extra'])
    .order('completed_at', { ascending: false })

  return (data as MissionProgressRow[] | null) ?? []
}

// ── awardBadge ────────────────────────────────────────────────────────────────
// Uses service role client to bypass RLS on child_badges (insert is admin-only).

export interface BadgeResult {
  id: string
  slug: string
  name: string
  description: string
  icon: string
}

export async function awardBadge(
  childProfileId: string,
  badgeSlug: string
): Promise<{ awarded: boolean; badge?: BadgeResult }> {
  // Auth check using normal client
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { awarded: false }

  // Verify ownership
  const { data: child } = await supabase
    .from('child_profiles')
    .select('id')
    .eq('id', childProfileId)
    .eq('user_id', user.id)
    .single()
  if (!child) return { awarded: false }

  // Use service client to bypass RLS
  const service = createServiceClient()

  const { data: badge } = await service
    .from('badges')
    .select('id, slug, name, description, icon')
    .eq('slug', badgeSlug)
    .single()
  if (!badge) return { awarded: false }

  const { error } = await service
    .from('child_badges')
    .insert({ child_profile_id: childProfileId, badge_id: badge.id })

  if (error) {
    // 23505 = unique_violation (already has badge)
    if (error.code === '23505') return { awarded: false }
    return { awarded: false }
  }

  return { awarded: true, badge }
}

// ── getProgressMap ────────────────────────────────────────────────────────────
// Returns a map from mission slug → progress status for all missions with any
// recorded progress (i.e. status ≠ 'not_started'). Returns {} if missions
// table is not yet seeded (graceful degradation).

export async function getProgressMap(
  childProfileId: string
): Promise<Record<string, 'started' | 'completed' | 'completed_extra'>> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return {}

  const { data } = await supabase
    .from('mission_progress')
    .select('status, missions ( slug )')
    .eq('child_profile_id', childProfileId)
    .neq('status', 'not_started')

  const map: Record<string, 'started' | 'completed' | 'completed_extra'> = {}
  for (const row of data ?? []) {
    const slug = (row.missions as unknown as { slug: string } | null)?.slug
    if (slug) {
      map[slug] = row.status as 'started' | 'completed' | 'completed_extra'
    }
  }
  return map
}

// ── getChildStats ─────────────────────────────────────────────────────────────

export interface ChildStats {
  missionsCompleted: number
  currentLevel: number
  badgesCount: number
  lastActivity: string | null
}

export async function getChildStats(
  childProfileId: string
): Promise<ChildStats | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: child } = await supabase
    .from('child_profiles')
    .select('id, current_level_id')
    .eq('id', childProfileId)
    .eq('user_id', user.id)
    .single()
  if (!child) return null

  const [
    { count: missionsCompleted },
    { count: badgesCount },
    { data: lastProgress },
  ] = await Promise.all([
    supabase
      .from('mission_progress')
      .select('*', { count: 'exact', head: true })
      .eq('child_profile_id', childProfileId)
      .in('status', ['completed', 'completed_extra']),
    supabase
      .from('child_badges')
      .select('*', { count: 'exact', head: true })
      .eq('child_profile_id', childProfileId),
    supabase
      .from('mission_progress')
      .select('updated_at')
      .eq('child_profile_id', childProfileId)
      .order('updated_at', { ascending: false })
      .limit(1),
  ])

  return {
    missionsCompleted: missionsCompleted ?? 0,
    currentLevel: child.current_level_id,
    badgesCount: badgesCount ?? 0,
    lastActivity: lastProgress?.[0]?.updated_at ?? null,
  }
}
