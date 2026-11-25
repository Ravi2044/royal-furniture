import type { Product } from '../types'

export const formatInr = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

export const createSlug = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const buildEnquiryMessage = (product?: Pick<Product, 'name' | 'slug'>) => {
  const base = 'Hello Royal Furniture, I would like to know more about your collection.'
  if (!product) return base
  return `Hello Royal Furniture, I am interested in ${product.name}. Could you please share availability and delivery details? (${window.location.origin}/products/${product.slug})`
}

export const getWhatsAppUrl = (message: string) => {
  const number = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : null
}
