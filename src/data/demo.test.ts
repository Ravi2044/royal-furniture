import { describe, expect, it } from 'vitest'
import { demoCategories, demoProducts } from './demo'
import { createSlug, formatInr } from '../lib/utils'

describe('demo catalogue', () => {
  it('keeps every product linked to a category and uses unique slugs', () => {
    const categoryIds = new Set(demoCategories.map((item) => item.id))
    expect(demoProducts.every((item) => categoryIds.has(item.category_id))).toBe(true)
    expect(new Set(demoProducts.map((item) => item.slug)).size).toBe(demoProducts.length)
  })

  it('formats catalogue values for India', () => {
    expect(formatInr(78900)).toContain('78,900')
    expect(createSlug('  Royal Lounge Chair  ')).toBe('royal-lounge-chair')
  })
})
