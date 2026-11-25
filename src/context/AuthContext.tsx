import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { OwnerProfile } from '../types'

type AuthContextValue = {
  session: Session | null
  user: User | null
  profile: OwnerProfile | null
  isOwner: boolean
  loading: boolean
  configured: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<OwnerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    const client = supabase

    const loadProfile = async (nextSession: Session | null) => {
      setSession(nextSession)
      if (!nextSession) { setProfile(null); setLoading(false); return }
      const { data } = await client.from('owner_profiles').select('user_id, display_name, is_owner').eq('user_id', nextSession.user.id).maybeSingle()
      setProfile((data as OwnerProfile | null) ?? null)
      setLoading(false)
    }

    client.auth.getSession().then(({ data }) => loadProfile(data.session))
    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => { void loadProfile(nextSession) })
    return () => listener.subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    profile,
    isOwner: Boolean(profile?.is_owner),
    loading,
    configured: isSupabaseConfigured,
    signIn: async (email, password) => {
      if (!supabase) throw new Error('Supabase is not configured yet.')
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    },
    signOut: async () => { if (supabase) await supabase.auth.signOut() },
  }), [session, profile, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthProvider')
  return value
}
