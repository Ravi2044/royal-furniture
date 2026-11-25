import { Boxes, ExternalLink, FolderTree, LayoutDashboard, LogOut } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Boxes },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
]

export function AdminLayout() {
  const { profile, signOut } = useAuth()
  return <div className="min-h-screen bg-[#f0eadf] text-royal-ink"><header className="border-b border-royal-green/10 bg-royal-green text-white"><div className="page-shell flex min-h-20 flex-wrap items-center justify-between gap-4 py-4"><div><p className="font-display text-2xl font-semibold">Royal Furniture</p><p className="text-xs uppercase tracking-[.18em] text-white/55">Owner studio</p></div><div className="flex items-center gap-3"><Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-sm font-semibold hover:bg-white/10">View site <ExternalLink size={16} /></Link><button type="button" onClick={() => void signOut()} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-royal-green"><LogOut size={16} /> Sign out</button></div></div></header>
    <div className="page-shell grid gap-8 py-8 lg:grid-cols-[240px_1fr]"><aside><div className="card p-4 lg:sticky lg:top-8"><div className="mb-4 border-b border-royal-green/10 px-3 pb-4"><p className="text-sm text-royal-ink/50">Signed in as</p><p className="mt-1 font-semibold text-royal-green">{profile?.display_name || 'Owner'}</p></div><nav className="grid gap-2">{navItems.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-semibold transition ${isActive ? 'bg-royal-green text-white' : 'text-royal-green hover:bg-royal-green/7'}`}><Icon size={18} />{label}</NavLink>)}</nav></div></aside><main><Outlet /></main></div>
  </div>
}
