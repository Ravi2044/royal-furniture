import { useMemo, useState, type FormEvent } from 'react'
import { CheckCircle2, MapPin, MessageCircle } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { EnquiryButton } from '../components/EnquiryButton'
import { demoProducts } from '../data/demo'
import { submitEnquiry } from '../services/catalog'

export function ContactPage() {
  const [params] = useSearchParams()
  const product = useMemo(() => demoProducts.find((item) => item.slug === params.get('product')), [params])
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setStatus('sending'); setError('')
    const form = new FormData(event.currentTarget)
    try {
      await submitEnquiry({ product_id: product?.id ?? null, name: String(form.get('name')), phone: String(form.get('phone')), email: String(form.get('email')), message: String(form.get('message')) })
      setStatus('sent'); event.currentTarget.reset()
    } catch (cause) { setStatus('idle'); setError(cause instanceof Error ? cause.message : 'Could not send the enquiry.') }
  }

  return <div className="page-shell py-20 sm:py-28"><div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
    <div><p className="eyebrow">Let’s talk furniture</p><h1 className="display-title mt-5">Start with your space.</h1><p className="mt-6 text-lg leading-8 text-royal-ink/65">Share the room, piece and timing you have in mind. Once Supabase and the owner’s verified WhatsApp number are configured, enquiries can be handled from this flow.</p><div className="mt-9 rounded-[2rem] bg-royal-green p-7 text-white"><div className="flex items-start gap-4"><MapPin className="mt-1 text-royal-gold" /><div><h2 className="font-display text-2xl font-semibold">Showroom details</h2><p className="mt-2 text-base leading-7 text-white/65">Intentionally blank in this demo. Add only a real, owner-approved address, hours, phone and email.</p></div></div><div className="mt-7"><EnquiryButton product={product} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-royal-cream px-6 font-semibold text-royal-green" /></div></div></div>
    <div className="card p-7 sm:p-10"><h2 className="font-display text-4xl font-semibold text-royal-green">Send an enquiry</h2>{product && <p className="mt-3 rounded-xl bg-royal-green/7 px-4 py-3 text-sm font-medium text-royal-green">About: {product.name}</p>}{status === 'sent' ? <div className="mt-10 rounded-2xl bg-emerald-50 p-6 text-emerald-900"><CheckCircle2 /><h3 className="mt-4 text-xl font-semibold">Enquiry received</h3><p className="mt-2">It is now available to the owner in Supabase.</p></div> : <form className="mt-8 grid gap-5" onSubmit={handleSubmit}><label className="grid gap-2 text-sm font-semibold text-royal-green">Name<input className="field" name="name" required autoComplete="name" /></label><div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-semibold text-royal-green">Phone<input className="field" name="phone" required autoComplete="tel" /></label><label className="grid gap-2 text-sm font-semibold text-royal-green">Email <span className="font-normal text-royal-ink/45">(optional)</span><input className="field" name="email" type="email" autoComplete="email" /></label></div><label className="grid gap-2 text-sm font-semibold text-royal-green">How can we help?<textarea className="field min-h-36 resize-y" name="message" required defaultValue={product ? `I would like to know more about ${product.name}.` : ''} /></label>{error && <p role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</p>}<button className="btn-primary w-fit" disabled={status === 'sending'}><MessageCircle size={19} />{status === 'sending' ? 'Sending…' : 'Send enquiry'}</button></form>}</div>
  </div></div>
}
