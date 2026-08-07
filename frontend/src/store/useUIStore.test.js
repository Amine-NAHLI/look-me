import { beforeEach, describe, expect, it } from 'vitest'
import { useUIStore } from './useUIStore'

const product = { id: 'product-1', name: 'Robe', price: 250, stock: 3, images: [] }

describe('useUIStore cart contract', () => {
  beforeEach(() => {
    localStorage.clear()
    useUIStore.setState({ cart: [], isCartOpen: false })
  })

  it('indexes cart lines with Prisma id and caps their quantity at stock', () => {
    useUIStore.getState().addToCart(product, 2)
    useUIStore.getState().addToCart(product, 2)

    expect(useUIStore.getState().cart).toEqual([{ ...product, qty: 3 }])
    expect(JSON.parse(localStorage.getItem('lookme_cart_v2'))[0].id).toBe(product.id)
  })

  it('removes a cart line using Prisma id', () => {
    useUIStore.getState().addToCart(product)
    useUIStore.getState().removeFromCart(product.id)

    expect(useUIStore.getState().cart).toEqual([])
  })
})
