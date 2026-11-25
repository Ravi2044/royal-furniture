import { useState } from 'react'
import { Armchair, Instagram, Menu, ShieldCheck, X } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

const links = [
  ['Home', '/'], ['Catalogue', '/catalogue'], ['About', '/about'], ['Gallery', '/gallery'], ['Contact', '/contact'],
]

export function Layout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-royal-cream text-royal-ink">
      <a href="#main" className="sr-only z-50 rounded bg-white px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <div className="bg-royal-green px-5 py-2 text-center text-sm text-white/85">
        Demo catalogue · Replace sample products and add verified business details before launch
      </div>
      <header className="sticky top-0 z-40 border-b border-royal-green/10 bg-royal-cream/95 backdrop-blur-xl">
        <div className="page-shell flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3" aria-label="Royal Furniture home">
            <span className="grid size-11 place-items-center rounded-full bg-royal-green text-royal-cream"><Armchair size={22} /></span>
            <span><span className="block font-display text-2xl font-bold leading-none text-royal-green">Royal Furniture</span><span className="mt-1 block text-xs uppercase tracking-[.2em] text-royal-brown">Crafted comfort</span></span>
          </Link>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
            {links.map(([label, to]) => <NavLink key={to} to={to} className={({ isActive }) => `text-sm font-semibold transition ${isActive ? 'text-royal-brown' : 'text-royal-green/75 hover:text-royal-green'}`}>{label}</NavLink>)}
          </nav>
          <div className="hidden lg:block"><Link className="btn-primary" to="/catalogue">Explore collection</Link></div>
          <button className="grid size-12 place-items-center rounded-full border border-royal-green/20 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
        </div>
        {open && <nav className="border-t border-royal-green/10 bg-royal-paper px-5 py-5 lg:hidden" aria-label="Mobile navigation">
          <div className="page-shell grid gap-2">{links.map(([label, to]) => <Link key={to} to={to} onClick={() => setOpen(false)} className={`rounded-xl px-4 py-3 text-base font-semibold ${location.pathname === to ? 'bg-royal-green text-white' : 'text-royal-green'}`}>{label}</Link>)}</div>
        </nav>}
      </header>
      <main id="main"><Outlet /></main>
      <footer className="bg-royal-green text-royal-cream">
        <div className="page-shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div><div className="font-display text-3xl font-semibold">Royal Furniture</div><p className="mt-4 max-w-md text-base leading-7 text-white/70">A complete demo storefront for a furniture business. Product data, branding and contact details are samples ready to be replaced by the owner.</p><span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/75"><ShieldCheck size={16} /> Secure owner-managed catalogue</span></div>
          <div><h2 className="text-sm font-semibold uppercase tracking-[.18em] text-royal-gold">Explore</h2><div className="mt-5 grid gap-3">{links.slice(1).map(([label, to]) => <Link key={to} to={to} className="w-fit text-white/75 hover:text-white">{label}</Link>)}</div></div>
          <div><h2 className="text-sm font-semibold uppercase tracking-[.18em] text-royal-gold">Demo notes</h2><p className="mt-5 text-base leading-7 text-white/70">No real phone, email, address or social profile is shown. Add only verified owner details during setup.</p><div className="mt-4 flex items-center gap-2 text-white/40"><Instagram size={18} /><span className="text-sm">Social link not configured</span></div></div>
        </div>
        <div className="border-t border-white/10"><div className="page-shell flex flex-col gap-3 py-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} Royal Furniture demo</span><Link to="/admin/login" className="hover:text-white">Owner sign in</Link></div></div>
      </footer>
    </div>
  )
}
