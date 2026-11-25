import { useEffect, useState, type FormEvent } from 'react'
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { createSlug } from '../../lib/utils'
import type { Category } from '../../types'

const blank = { id: '', name: '', slug: '', description: '', sort_order: 0 }

export function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>([])
  const [editing, setEditing] = useState<Category | null>(null)
  const [error, setError] = useState('')

  const load = async () => { if (!supabase) return; const { data, error } = await supabase.from('categories').select('*').order('sort_order'); if (error) setError(error.message); else setItems((data ?? []) as Category[]) }
  useEffect(() => { void load() }, [])

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!supabase || !editing) return; setError('')
    const form = new FormData(event.currentTarget)
    const payload = { name: String(form.get('name')), slug: String(form.get('slug')) || createSlug(String(form.get('name'))), description: String(form.get('description')), sort_order: Number(form.get('sort_order')) }
    const query = editing.id ? supabase.from('categories').update(payload).eq('id', editing.id) : supabase.from('categories').insert(payload)
    const { error } = await query; if (error) setError(error.message); else { setEditing(null); await load() }
  }
  const remove = async (item: Category) => { if (!supabase || !window.confirm(`Delete “${item.name}”? Products in this category must be moved first.`)) return; const { error } = await supabase.from('categories').delete().eq('id', item.id); if (error) setError(error.message); else await load() }

  return <div><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">Catalogue structure</p><h1 className="mt-3 font-display text-5xl font-semibold text-royal-green">Categories</h1></div><button className="btn-primary" onClick={() => setEditing(blank)}><Plus size={18} /> Add category</button></div>{error && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
    {editing && <form onSubmit={save} className="card mt-7 grid gap-5 p-7"><div className="flex items-center justify-between"><h2 className="font-display text-3xl font-semibold text-royal-green">{editing.id ? 'Edit category' : 'New category'}</h2><button type="button" onClick={() => setEditing(null)} aria-label="Close"><X /></button></div><div className="grid gap-5 md:grid-cols-2"><label className="grid gap-2 text-sm font-semibold text-royal-green">Name<input className="field" name="name" defaultValue={editing.name} required /></label><label className="grid gap-2 text-sm font-semibold text-royal-green">Slug<input className="field" name="slug" defaultValue={editing.slug} placeholder="Generated from name if blank" /></label></div><label className="grid gap-2 text-sm font-semibold text-royal-green">Description<textarea className="field min-h-24" name="description" defaultValue={editing.description} /></label><label className="grid max-w-40 gap-2 text-sm font-semibold text-royal-green">Sort order<input className="field" name="sort_order" type="number" defaultValue={editing.sort_order} /></label><button className="btn-primary w-fit"><Save size={18} /> Save category</button></form>}
    <div className="card mt-7 overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead className="bg-royal-green/7 text-sm uppercase tracking-[.1em] text-royal-green"><tr><th className="px-6 py-4">Category</th><th className="px-6 py-4">Slug</th><th className="px-6 py-4">Order</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-royal-green/10">{items.map((item) => <tr key={item.id}><td className="px-6 py-5"><p className="font-semibold text-royal-green">{item.name}</p><p className="mt-1 max-w-md text-sm text-royal-ink/55">{item.description}</p></td><td className="px-6 py-5 text-sm text-royal-ink/60">{item.slug}</td><td className="px-6 py-5">{item.sort_order}</td><td className="px-6 py-5"><div className="flex justify-end gap-2"><button className="grid size-10 place-items-center rounded-full border border-royal-green/15" onClick={() => setEditing(item)} aria-label={`Edit ${item.name}`}><Pencil size={17} /></button><button className="grid size-10 place-items-center rounded-full border border-red-200 text-red-700" onClick={() => void remove(item)} aria-label={`Delete ${item.name}`}><Trash2 size={17} /></button></div></td></tr>)}</tbody></table></div></div>
  </div>
}
