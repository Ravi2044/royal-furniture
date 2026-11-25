import { useEffect, useState } from 'react'
import { Boxes, FolderTree, MessageSquareText, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

type Counts = { products: number; categories: number; featured: number; enquiries: number }

export function AdminDashboardPage() {
  const [counts, setCounts] = useState<Counts>({ products: 0, categories: 0, featured: 0, enquiries: 0 })
  useEffect(() => { if (!supabase) return; Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('featured', true),
    supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  ]).then(([products, categories, featured, enquiries]) => setCounts({ products: products.count ?? 0, categories: categories.count ?? 0, featured: featured.count ?? 0, enquiries: enquiries.count ?? 0 })) }, [])

  const stats = [
    ['Products', counts.products, Boxes], ['Categories', counts.categories, FolderTree], ['Featured', counts.featured, Star], ['New enquiries', counts.enquiries, MessageSquareText],
  ] as const

  return <div><p className="eyebrow">Owner overview</p><h1 className="mt-3 font-display text-5xl font-semibold text-royal-green">Catalogue at a glance.</h1><div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value, Icon]) => <article className="card p-6" key={label}><Icon className="text-royal-brown" /><p className="mt-7 text-sm font-semibold uppercase tracking-[.12em] text-royal-ink/50">{label}</p><p className="mt-1 font-display text-4xl font-semibold text-royal-green">{value}</p></article>)}</div><div className="mt-8 grid gap-6 lg:grid-cols-2"><section className="card p-7"><h2 className="font-display text-3xl font-semibold text-royal-green">Keep the collection current</h2><p className="mt-3 leading-7 text-royal-ink/60">Add new pieces, upload product imagery, set availability and choose what appears on the homepage.</p><Link to="/admin/products" className="btn-primary mt-6">Manage products</Link></section><section className="card p-7"><h2 className="font-display text-3xl font-semibold text-royal-green">Organise the showroom</h2><p className="mt-3 leading-7 text-royal-ink/60">Categories control the public filters and the way every product is grouped.</p><Link to="/admin/categories" className="btn-secondary mt-6">Manage categories</Link></section></div></div>
}
