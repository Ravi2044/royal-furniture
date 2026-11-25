import { useEffect, useState, type FormEvent } from 'react'
import { ImagePlus, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { createSlug, formatInr } from '../../lib/utils'
import type { Category, Product } from '../../types'

const blankProduct: Product = {
  id: '', category_id: '', name: '', slug: '', short_description: '', description: '', price_inr: 0,
  compare_at_price_inr: null, primary_image_url: '', image_urls: [], materials: [], dimensions: '',
  featured: false, in_stock: true, is_published: true,
}

export function AdminProductsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    if (!supabase) return
    const [products, categoryResult] = await Promise.all([
      supabase.from('products').select('*, category:categories(*)').order('updated_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
    ])
    if (products.error || categoryResult.error) setError(products.error?.message || categoryResult.error?.message || 'Could not load the catalogue.')
    else { setItems((products.data ?? []) as Product[]); setCategories((categoryResult.data ?? []) as Category[]) }
  }
  useEffect(() => { void load() }, [])

  const uploadFiles = async (files: File[]) => {
    if (!supabase || !user || !files.length) return []
    const urls: string[] = []
    for (const file of files) {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `${user.id}/${crypto.randomUUID()}.${extension}`
      const { error } = await supabase.storage.from('product-images').upload(path, file, { cacheControl: '3600', upsert: false })
      if (error) throw error
      const { data } = supabase.storage.from('product-images').getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    return urls
  }

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!supabase || !editing) return; setSaving(true); setError('')
    try {
      const form = new FormData(event.currentTarget)
      const files = form.getAll('images').filter((value): value is File => value instanceof File && value.size > 0)
      const uploaded = await uploadFiles(files)
      const images = [...editing.image_urls, ...uploaded]
      const payload = {
        category_id: String(form.get('category_id')),
        name: String(form.get('name')),
        slug: String(form.get('slug')) || createSlug(String(form.get('name'))),
        short_description: String(form.get('short_description')),
        description: String(form.get('description')),
        price_inr: Number(form.get('price_inr')),
        compare_at_price_inr: form.get('compare_at_price_inr') ? Number(form.get('compare_at_price_inr')) : null,
        primary_image_url: uploaded[0] || editing.primary_image_url || '/assets/products/sofa-olive.svg',
        image_urls: images.length ? images : [editing.primary_image_url || '/assets/products/sofa-olive.svg'],
        materials: String(form.get('materials')).split(',').map((item) => item.trim()).filter(Boolean),
        dimensions: String(form.get('dimensions')),
        featured: form.get('featured') === 'on', in_stock: form.get('in_stock') === 'on', is_published: form.get('is_published') === 'on',
      }
      const result = editing.id ? await supabase.from('products').update(payload).eq('id', editing.id) : await supabase.from('products').insert(payload)
      if (result.error) throw result.error
      setEditing(null); await load()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save the product.') }
    finally { setSaving(false) }
  }

  const remove = async (product: Product) => {
    if (!supabase || !window.confirm(`Delete “${product.name}”? This removes the catalogue record but keeps uploaded files for safety.`)) return
    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (error) setError(error.message); else await load()
  }

  return <div><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">Catalogue content</p><h1 className="mt-3 font-display text-5xl font-semibold text-royal-green">Products</h1></div><button className="btn-primary" onClick={() => setEditing({ ...blankProduct })}><Plus size={18} /> Add product</button></div>{error && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
    {editing && <form className="card mt-7 grid gap-6 p-6 sm:p-8" onSubmit={save}><div className="flex items-center justify-between"><div><p className="eyebrow">{editing.id ? 'Editing' : 'New catalogue piece'}</p><h2 className="mt-2 font-display text-3xl font-semibold text-royal-green">{editing.name || 'Untitled product'}</h2></div><button type="button" onClick={() => setEditing(null)} aria-label="Close product editor"><X /></button></div>
      <div className="grid gap-5 md:grid-cols-2"><label className="grid gap-2 text-sm font-semibold text-royal-green">Product name<input className="field" name="name" defaultValue={editing.name} required /></label><label className="grid gap-2 text-sm font-semibold text-royal-green">URL slug<input className="field" name="slug" defaultValue={editing.slug} placeholder="Generated from name if blank" /></label></div>
      <label className="grid gap-2 text-sm font-semibold text-royal-green">Short description<input className="field" name="short_description" defaultValue={editing.short_description} required maxLength={160} /></label>
      <label className="grid gap-2 text-sm font-semibold text-royal-green">Full description<textarea className="field min-h-32" name="description" defaultValue={editing.description} required /></label>
      <div className="grid gap-5 md:grid-cols-3"><label className="grid gap-2 text-sm font-semibold text-royal-green">Category<select className="field" name="category_id" defaultValue={editing.category_id} required><option value="" disabled>Select category</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label><label className="grid gap-2 text-sm font-semibold text-royal-green">Price (INR)<input className="field" name="price_inr" type="number" min="0" defaultValue={editing.price_inr} required /></label><label className="grid gap-2 text-sm font-semibold text-royal-green">Compare-at price<input className="field" name="compare_at_price_inr" type="number" min="0" defaultValue={editing.compare_at_price_inr ?? ''} /></label></div>
      <div className="grid gap-5 md:grid-cols-2"><label className="grid gap-2 text-sm font-semibold text-royal-green">Materials <span className="font-normal text-royal-ink/45">(comma separated)</span><input className="field" name="materials" defaultValue={editing.materials.join(', ')} /></label><label className="grid gap-2 text-sm font-semibold text-royal-green">Dimensions<input className="field" name="dimensions" defaultValue={editing.dimensions} /></label></div>
      <label className="grid cursor-pointer gap-3 rounded-2xl border border-dashed border-royal-green/30 bg-royal-green/[.03] p-6"><span className="flex items-center gap-3 font-semibold text-royal-green"><ImagePlus /> Upload product images</span><span className="text-sm font-normal text-royal-ink/55">JPG, PNG or WebP. New uploads are appended; the first new image becomes the cover.</span><input name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple className="text-sm file:mr-4 file:rounded-full file:border-0 file:bg-royal-green file:px-4 file:py-2 file:font-semibold file:text-white" /></label>
      {editing.primary_image_url && <div className="flex items-center gap-4"><img src={editing.primary_image_url} alt="Current product cover" className="size-24 rounded-2xl object-cover" /><p className="text-sm text-royal-ink/55">Current cover image</p></div>}
      <div className="flex flex-wrap gap-5 rounded-2xl bg-royal-green/[.04] p-5">{[['featured', 'Feature on homepage', editing.featured], ['in_stock', 'Available / in stock', editing.in_stock], ['is_published', 'Published publicly', editing.is_published]].map(([name, label, checked]) => <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-royal-green" key={String(name)}><input type="checkbox" name={String(name)} defaultChecked={Boolean(checked)} className="size-5 accent-royal-green" />{String(label)}</label>)}</div>
      <button className="btn-primary w-fit" disabled={saving}><Save size={18} />{saving ? 'Saving…' : 'Save product'}</button>
    </form>}
    <div className="card mt-7 overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left"><thead className="bg-royal-green/7 text-sm uppercase tracking-[.1em] text-royal-green"><tr><th className="px-6 py-4">Product</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-royal-green/10">{items.map((product) => <tr key={product.id}><td className="px-6 py-5"><div className="flex items-center gap-4"><img src={product.primary_image_url} alt="" className="size-16 rounded-xl object-cover" /><div><p className="font-semibold text-royal-green">{product.name}</p><p className="mt-1 text-sm text-royal-ink/50">/{product.slug}</p></div></div></td><td className="px-6 py-5 text-sm">{product.category?.name}</td><td className="px-6 py-5 font-semibold text-royal-green">{formatInr(product.price_inr)}</td><td className="px-6 py-5"><div className="flex flex-wrap gap-2">{product.is_published ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Published</span> : <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Draft</span>}{product.featured && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">Featured</span>}</div></td><td className="px-6 py-5"><div className="flex justify-end gap-2"><button className="grid size-10 place-items-center rounded-full border border-royal-green/15" onClick={() => setEditing(product)} aria-label={`Edit ${product.name}`}><Pencil size={17} /></button><button className="grid size-10 place-items-center rounded-full border border-red-200 text-red-700" onClick={() => void remove(product)} aria-label={`Delete ${product.name}`}><Trash2 size={17} /></button></div></td></tr>)}</tbody></table></div></div>
  </div>
}
