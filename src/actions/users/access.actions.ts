'use server'

import prisma from '@/lib/prisma'
import { validateUserAdmin } from '../auth/validate-user-admin'
import { revalidatePath } from 'next/cache'

export async function grantAcademyAccess(userId: string) {
  try {
    const isAdmin = await validateUserAdmin()
    if (!isAdmin) {
      return { ok: false, message: 'Unauthorized' }
    }

    // 1. Find the Academy product
    const academyProduct = await prisma.product.findFirst({
      where: { type: 'academy' }
    })

    if (!academyProduct) {
      return { ok: false, message: 'Academy product not found in database. Please contact support.' }
    }

    // 2. Check if user already has it
    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: academyProduct.id
        }
      }
    })

    if (existingPurchase) {
      return { ok: false, message: 'User already has Academy access' }
    }

    // 3. Create purchase
    await prisma.purchase.create({
      data: {
        userId,
        productId: academyProduct.id
      }
    })

    revalidatePath(`/platform/admin/users/${userId}`)
    return { ok: true, message: 'Academy access granted' }
  } catch (error) {
    console.error('Error granting access:', error)
    return { ok: false, message: 'Error granting access' }
  }
}

export async function revokeAcademyAccess(userId: string) {
  try {
    const isAdmin = await validateUserAdmin()
    if (!isAdmin) {
      return { ok: false, message: 'Unauthorized' }
    }

    const academyProduct = await prisma.product.findFirst({
      where: { type: 'academy' }
    })

    if (!academyProduct) {
      return { ok: false, message: 'Academy product not found' }
    }

    await prisma.purchase.deleteMany({
      where: {
        userId,
        productId: academyProduct.id
      }
    })

    revalidatePath(`/platform/admin/users/${userId}`)
    return { ok: true, message: 'Academy access removed' }
  } catch (error) {
    console.error('Error revoking access:', error)
    return { ok: false, message: 'Error removing access' }
  }
}

export async function checkUserAcademyAccess(userId: string) {
  try {
    const purchase = await prisma.purchase.findFirst({
      where: {
        userId,
        product: {
          type: 'academy'
        }
      }
    })
    return !!purchase
  } catch {
    return false
  }
}
