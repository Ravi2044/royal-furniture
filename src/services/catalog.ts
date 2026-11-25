import { demoCategories, demoProducts } from '../data/demo'
import { supabase } from '../lib/supabase'
import type { Category, EnquiryInput, Product } from '../types'

export async function getCategories(): Promise<Category[]> {
  if (!supabase) return demoCategories
  const { data, error } = await supabase.from('categories').select('*').order('sort_order')
  if (error) throw error
  return (data ?? []) as Category[]
}

export async function getProducts(options: { includeUnpublished?: boolean } = {}): Promise<Product[]> {
  if (!supabase) return demoProducts
  let query = supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false })
  if (!options.includeUnpublished) query = query.eq('is_published', true)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Product[]
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!supabase) return demoProducts.find((product) => product.slug === slug) ?? null
  const { data, error } = await supabase.from('products').select('*, category:categories(*)').eq('slug', slug).eq('is_published', true).maybeSingle()
  if (error) throw error
  return data as Product | null
}

export async function submitEnquiry(input: EnquiryInput) {
  if (!supabase) throw new Error('This demo is not connected to a database yet. Please use the prepared WhatsApp message or configure Supabase.')
  const { error } = await supabase.from('enquiries').insert(input)
  if (error) throw error
}
