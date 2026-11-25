import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { Loading } from '../../components/Loading'
import { useAuth } from '../../context/AuthContext'

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { configured, loading, user, isOwner } = useAuth()
  if (!configured) return <div className="grid min-h-screen place-items-center bg-royal-cream p-5"><div className="card max-w-lg p-9 text-center"><h1 className="font-display text-4xl font-semibold text-royal-green">Connect Supabase first</h1><p className="mt-4 leading-7 text-royal-ink/65">The public demo works locally, but the owner dashboard stays locked until the Supabase URL and public anon key are configured.</p><a className="btn-primary mt-7" href="/admin/login">View setup state</a></div></div>
  if (loading) return <Loading label="Checking owner access" />
  if (!user) return <Navigate to="/admin/login" replace />
  if (!isOwner) return <div className="grid min-h-screen place-items-center bg-royal-cream p-5"><div className="card max-w-lg p-9 text-center"><h1 className="font-display text-4xl font-semibold text-royal-green">Owner access required</h1><p className="mt-4 leading-7 text-royal-ink/65">This authenticated account is not listed in <code>owner_profiles</code>. Ask the project owner to complete the owner bootstrap step in the README.</p><a href="/" className="btn-secondary mt-7">Return to site</a></div></div>
  return children
}
