import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { formatInr } from '../lib/utils'

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-royal-green/10 bg-royal-paper transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <Link to={`/products/${product.slug}`} className="block overflow-hidden bg-[#e9dfcf]">
        <img src={product.primary_image_url} alt={product.name} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
      </Link>
      <div className="p-6">
        <div className="flex items-start justify-between gap-5"><div><p className="text-sm font-semibold uppercase tracking-[.14em] text-royal-brown">{product.category?.name ?? 'Collection'}</p><h3 className="mt-2 font-display text-2xl font-semibold text-royal-green"><Link to={`/products/${product.slug}`}>{product.name}</Link></h3></div><Link to={`/products/${product.slug}`} className="grid size-11 shrink-0 place-items-center rounded-full border border-royal-green/15 text-royal-green transition group-hover:bg-royal-green group-hover:text-white" aria-label={`View ${product.name}`}><ArrowUpRight size={19} /></Link></div>
        <p className="mt-3 line-clamp-2 min-h-12 text-base leading-6 text-royal-ink/65">{product.short_description}</p>
        <div className="mt-5 flex items-baseline gap-3"><span className="text-lg font-semibold text-royal-green">{formatInr(product.price_inr)}</span>{product.compare_at_price_inr && <span className="text-sm text-royal-ink/45 line-through">{formatInr(product.compare_at_price_inr)}</span>}</div>
      </div>
    </article>
  )
}
