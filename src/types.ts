export type Category = {
  id: string
  name: string
  slug: string
  description: string
  sort_order: number
  created_at?: string
}

export type Product = {
  id: string
  category_id: string
  name: string
  slug: string
  short_description: string
  description: string
  price_inr: number
  compare_at_price_inr: number | null
  primary_image_url: string
  image_urls: string[]
  materials: string[]
  dimensions: string
  featured: boolean
  in_stock: boolean
  is_published: boolean
  created_at?: string
  updated_at?: string
  category?: Category
}

export type OwnerProfile = {
  user_id: string
  display_name: string
  is_owner: boolean
}

export type EnquiryInput = {
  product_id?: string | null
  name: string
  phone: string
  email?: string
  message: string
}
