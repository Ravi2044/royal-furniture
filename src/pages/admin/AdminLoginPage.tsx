import { useState, type FormEvent } from 'react'
import { KeyRound, LockKeyhole } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function AdminLoginPage() {
  const { configured, user, isOwner, signIn } = useAuth()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  if (user && isOwner) return <Navigate to="/admin" replace />

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSubmitting(true); setError('')
    const form = new FormData(event.currentTarget)
    try { await signIn(String(form.get('email')), String(form.get('password'))) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Sign in failed.') }
    finally { setSubmitting(false) }
  }

  return <div className="page-shell grid min-h-[70vh] place-items-center py-16"><div className="card w-full max-w-lg p-7 sm:p-10"><div className="grid size-14 place-items-center rounded-full bg-royal-green text-white"><LockKeyhole /></div><p className="eyebrow mt-7">Private owner area</p><h1 className="mt-3 font-display text-5xl font-semibold text-royal-green">Manage the collection.</h1><p className="mt-4 leading-7 text-royal-ink/65">Authentication is handled by Supabase. Only users explicitly added to <code>owner_profiles</code> can open the dashboard or modify catalogue data.</p>
    {!configured ? <div className="mt-7 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950"><p className="font-semibold">Supabase is not configured.</p><p className="mt-2 text-sm leading-6">Copy <code>.env.example</code> to <code>.env.local</code>, add the project URL and public anon key, run the SQL migration, then restart the development server.</p></div> : <form className="mt-8 grid gap-5" onSubmit={handleSubmit}><label className="grid gap-2 text-sm font-semibold text-royal-green">Owner email<input name="email" type="email" className="field" autoComplete="email" required /></label><label className="grid gap-2 text-sm font-semibold text-royal-green">Password<input name="password" type="password" className="field" autoComplete="current-password" required /></label>{error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}<button className="btn-primary" disabled={submitting}><KeyRound size={18} />{submitting ? 'Signing in…' : 'Sign in securely'}</button></form>}
  </div></div>
}
