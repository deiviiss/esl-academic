'use server'

import { validateUserAdmin } from '@/actions/auth/validate-user-admin'
import prisma from '@/lib/prisma'

interface CreateProductData {
  name: string
  type: string
  price: number
}

export const createProduct = async (data: CreateProductData) => {
  try {
    const isAdmin = await validateUserAdmin()

    if (!isAdmin) {
      return {
        ok: false,
        message: 'You must be authenticated as an administrator'
      }
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        type: data.type,
        price: data.price
      }
    })

    return {
      ok: true,
      message: 'Product created successfully',
      product
    }
  } catch (error) {
    console.error('Error creating product:', error)
    return {
      ok: false,
      message: 'Error creating product'
    }
  }
}