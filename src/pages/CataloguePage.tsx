import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Loading } from '../components/Loading'
import { ProductCard } from '../components/ProductCard'
import { getCategories, getProducts } from '../services/catalog'
import type { Category, Product } from '../types'

export function CataloguePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [stockOnly, setStockOnly] = useState(false)
  const [sort, setSort] = useState('featured')

  useEffect(() => { Promise.all([getProducts(), getCategories()]).then(([p, c]) => { setProducts(p); setCategories(c) }).finally(() => setLoading(false)) }, [])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    const result = products.filter((item) => (category === 'all' || item.category_id === category) && (!stockOnly || item.in_stock) && (!query || `${item.name} ${item.short_description} ${item.materials.join(' ')}`.toLowerCase().includes(query)))
    return [...result].sort((a, b) => sort === 'price-low' ? a.price_inr - b.price_inr : sort === 'price-high' ? b.price_inr - a.price_inr : Number(b.featured) - Number(a.featured))
  }, [products, category, stockOnly, search, sort])

  return <div className="page-shell py-16 sm:py-24">
    <div className="max-w-3xl"><p className="eyebrow">Royal collection</p><h1 className="display-title mt-5">Find your room’s anchor.</h1><p className="mt-6 text-lg leading-8 text-royal-ink/65">Browse the sample collection by category, material or availability. Prices and products are illustrative demo content.</p></div>
    <div className="mt-12 rounded-[2rem] border border-royal-green/10 bg-royal-paper p-5 shadow-soft">
      <div className="grid gap-4 lg:grid-cols-[1fr_220px_200px_auto]">
        <label className="relative"><span className="sr-only">Search products</span><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-royal-green/45" size={20} /><input className="field pl-12" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or material" /></label>
        <label><span className="sr-only">Category</span><select className="field" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label><span className="sr-only">Sort products</span><select className="field" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
        <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-royal-green/15 px-4"><input type="checkbox" checked={stockOnly} onChange={(event) => setStockOnly(event.target.checked)} className="size-5 accent-royal-green" /><span className="text-sm font-semibold text-royal-green">In stock</span></label>
      </div>
    </div>
    <div className="mt-10 flex items-center justify-between"><p className="text-base text-royal-ink/60">{filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}</p><SlidersHorizontal className="text-royal-brown" size={20} /></div>
    {loading ? <Loading /> : filtered.length ? <div className="mt-6 grid gap-7 md:grid-cols-2 lg:grid-cols-3">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="mt-8 rounded-[2rem] border border-dashed border-royal-green/25 py-20 text-center"><h2 className="font-display text-3xl text-royal-green">No pieces match those filters.</h2><button className="mt-5 text-base font-semibold text-royal-brown" onClick={() => { setSearch(''); setCategory('all'); setStockOnly(false) }}>Clear filters</button></div>}
  </div>
}
