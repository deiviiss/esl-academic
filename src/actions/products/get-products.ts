'use server'

import prisma from '@/lib/prisma'

export const getProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })

    return {
      ok: true,
      products
    }
  } catch (error) {
    console.error('Error getting products:', error)
    return {
      ok: false,
      message: 'Error fetching products',
      products: []
    }
  }
}

export const getProductById = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return {
        ok: false,
        message: 'Product not found'
      }
    }

    return {
      ok: true,
      product
    }
  } catch (error) {
    console.error('Error getting product:', error)
    return {
      ok: false,
      message: 'Error fetching product'
    }
  }
}