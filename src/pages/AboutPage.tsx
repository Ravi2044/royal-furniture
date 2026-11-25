import { Hammer, Heart, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AboutPage() {
  return <>
    <section className="page-shell grid gap-14 py-20 lg:grid-cols-[.9fr_1.1fr] lg:items-end lg:py-28"><div><p className="eyebrow">Sample brand story</p><h1 className="display-title mt-5">Made slowly. Lived with fully.</h1></div><p className="max-w-2xl text-xl leading-9 text-royal-ink/65">Royal Furniture is presented here as a warm, contemporary furniture brand focused on considered forms and honest materials. This story is placeholder copy ready for the real owner’s history and craft process.</p></section>
    <section className="bg-royal-green py-20 text-white sm:py-28"><div className="page-shell grid gap-8 md:grid-cols-3">{[
      [Leaf, 'Materials with character', 'Wood grain, woven cane and tactile upholstery create warmth that improves with use.'],
      [Hammer, 'Useful craftsmanship', 'Joinery and construction are described clearly, without decorative claims the owner cannot verify.'],
      [Heart, 'Designed around home', 'Comfort, proportion and practical care guide the catalogue from first browse to final enquiry.'],
    ].map(([Icon, title, text], index) => <article key={index} className="rounded-[2rem] border border-white/10 bg-white/5 p-8"><Icon className="text-royal-gold" size={30} /><h2 className="mt-8 font-display text-3xl font-semibold">{String(title)}</h2><p className="mt-4 text-base leading-7 text-white/65">{String(text)}</p></article>)}</div></section>
    <section className="page-shell py-24 sm:py-32"><div className="grid gap-12 lg:grid-cols-2"><div className="grain min-h-96 rounded-[2.5rem] bg-royal-brown/10 p-10"><div className="flex h-full items-end"><p className="max-w-sm font-display text-4xl font-semibold leading-tight text-royal-green">“A room feels complete when every piece has a reason to be there.”</p></div></div><div className="flex flex-col justify-center"><p className="eyebrow">Ready for the real story</p><h2 className="section-title mt-4">Turn this demo into the owner’s own showroom.</h2><p className="mt-6 text-lg leading-8 text-royal-ink/65">The secure dashboard lets the owner replace these sample categories, descriptions, prices and images without editing source code.</p><Link to="/catalogue" className="btn-primary mt-8 w-fit">Browse sample pieces</Link></div></div></section>
  </>
}
