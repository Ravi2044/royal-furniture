import { useEffect, useState } from 'react'
import { CheckCircle2, ChevronLeft, PackageCheck, Ruler, ShieldCheck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { EnquiryButton } from '../components/EnquiryButton'
import { Loading } from '../components/Loading'
import { formatInr } from '../lib/utils'
import { getProductBySlug } from '../services/catalog'
import type { Product } from '../types'

export function ProductPage() {
  const { slug = '' } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { getProductBySlug(slug).then(setProduct).finally(() => setLoading(false)) }, [slug])
  if (loading) return <Loading />
  if (!product) return <div className="page-shell py-24 text-center"><h1 className="section-title">Piece not found.</h1><Link to="/catalogue" className="btn-primary mt-8">Return to catalogue</Link></div>

  return <div className="page-shell py-12 sm:py-20">
    <Link to="/catalogue" className="inline-flex items-center gap-2 text-sm font-semibold text-royal-green/70 hover:text-royal-green"><ChevronLeft size={18} /> Back to collection</Link>
    <div className="mt-8 grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
      <div className="overflow-hidden rounded-[2.5rem] bg-[#e8ddcc]"><img src={product.primary_image_url} alt={product.name} className="aspect-[4/3] w-full object-cover" /></div>
      <div className="lg:sticky lg:top-28"><p className="eyebrow">{product.category?.name ?? 'Royal collection'}</p><h1 className="mt-4 font-display text-5xl font-semibold leading-none text-royal-green sm:text-6xl">{product.name}</h1><p className="mt-6 text-lg leading-8 text-royal-ink/68">{product.description}</p><div className="mt-7 flex items-baseline gap-3"><span className="text-3xl font-semibold text-royal-green">{formatInr(product.price_inr)}</span>{product.compare_at_price_inr && <span className="text-lg text-royal-ink/40 line-through">{formatInr(product.compare_at_price_inr)}</span>}</div><p className="mt-2 text-sm text-royal-ink/50">Sample price · taxes and delivery policy to be configured</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row"><EnquiryButton product={product} /><Link to={`/contact?product=${product.slug}`} className="btn-secondary">Send an enquiry</Link></div>
        <div className="mt-9 divide-y divide-royal-green/10 border-y border-royal-green/10">
          <div className="flex items-start gap-4 py-5"><Ruler className="mt-1 text-royal-brown" size={20} /><div><p className="font-semibold text-royal-green">Dimensions</p><p className="mt-1 text-base text-royal-ink/60">{product.dimensions}</p></div></div>
          <div className="flex items-start gap-4 py-5"><PackageCheck className="mt-1 text-royal-brown" size={20} /><div><p className="font-semibold text-royal-green">Availability</p><p className="mt-1 text-base text-royal-ink/60">{product.in_stock ? 'Available for enquiry' : 'Currently made to order'}</p></div></div>
          <div className="flex items-start gap-4 py-5"><ShieldCheck className="mt-1 text-royal-brown" size={20} /><div><p className="font-semibold text-royal-green">Materials</p><div className="mt-2 flex flex-wrap gap-2">{product.materials.map((material) => <span key={material} className="inline-flex items-center gap-1 rounded-full bg-royal-green/7 px-3 py-1 text-sm text-royal-green"><CheckCircle2 size={14} />{material}</span>)}</div></div></div>
        </div>
      </div>
    </div>
  </div>
}
