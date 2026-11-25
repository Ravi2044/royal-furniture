import { useEffect, useState } from 'react'
import { ArrowDown, BadgeCheck, Leaf, Ruler, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { demoProducts } from '../data/demo'
import { getProducts } from '../services/catalog'
import type { Product } from '../types'

export function HomePage() {
  const [products, setProducts] = useState<Product[]>(demoProducts.filter((item) => item.featured))

  useEffect(() => { getProducts().then((data) => setProducts(data.filter((item) => item.featured).slice(0, 4))).catch(() => undefined) }, [])

  return <>
    <section className="relative isolate min-h-[760px] overflow-hidden bg-[#d8c6aa] lg:min-h-[calc(100vh-7rem)]">
      <img src="/assets/royal-furniture-hero.png" alt="Olive sofa and walnut table in a warm, elegant living room" className="absolute inset-0 h-full w-full object-cover object-[62%_center] lg:object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#f3e8d6]/95 via-[#f3e8d6]/75 to-transparent lg:via-[#f3e8d6]/20" />
      <div className="page-shell relative flex min-h-[760px] items-center py-24 lg:min-h-[calc(100vh-7rem)]">
        <div className="max-w-2xl">
          <p className="eyebrow">The considered home collection</p>
          <h1 className="display-title mt-6">Furniture with a quieter kind of luxury.</h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-royal-ink/75">Warm woods, tactile fabrics and enduring forms — a sample catalogue designed to make every room feel deeply personal.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link to="/catalogue" className="btn-primary">Explore the collection</Link><Link to="/about" className="btn-secondary">Our design approach</Link></div>
          <a href="#featured" className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-royal-green"><ArrowDown size={18} /> Scroll to discover</a>
        </div>
      </div>
    </section>

    <section className="border-y border-royal-green/10 bg-royal-paper">
      <div className="page-shell grid divide-y divide-royal-green/10 py-3 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {[['Honest materials', Leaf], ['Made for real homes', Ruler], ['Owner-managed catalogue', BadgeCheck]].map(([label, Icon], index) => <div key={index} className="flex items-center justify-center gap-3 px-5 py-5 text-sm font-semibold text-royal-green"><Icon size={19} />{String(label)}</div>)}
      </div>
    </section>

    <section id="featured" className="page-shell py-24 sm:py-32">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="eyebrow">Signature pieces</p><h2 className="section-title mt-4">Designed to belong.</h2></div><Link to="/catalogue" className="btn-secondary">View all products</Link></div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    </section>

    <section className="overflow-hidden bg-royal-green text-white">
      <div className="page-shell grid items-center gap-14 py-24 lg:grid-cols-2 lg:py-32">
        <div><p className="text-sm font-semibold uppercase tracking-[.18em] text-royal-gold">A thoughtful foundation</p><h2 className="mt-5 font-display text-5xl font-semibold leading-none sm:text-6xl">Built for the life that happens around it.</h2><p className="mt-7 max-w-xl text-lg leading-8 text-white/68">The demo brand is grounded in three ideas: useful proportions, tactile natural materials and pieces that can live gracefully with changing homes.</p><Link to="/about" className="mt-9 inline-flex min-h-12 items-center rounded-full bg-royal-cream px-6 font-semibold text-royal-green">Read the story</Link></div>
        <div className="relative grid aspect-square place-items-center rounded-full border border-white/10 bg-white/5"><div className="absolute inset-[10%] rounded-full border border-white/10" /><Sparkles size={48} className="text-royal-gold" /><p className="absolute max-w-[16rem] text-center font-display text-3xl leading-tight">Warmth in every detail</p></div>
      </div>
    </section>
  </>
}
