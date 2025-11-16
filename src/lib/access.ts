import prisma from './prisma'

export type ProductType = 'academy' | 'course'

/**
 * Verifica si un usuario tiene acceso a un tipo de producto específico
 * @param userId - ID del usuario
 * @param productType - Tipo de producto ('academy' | 'course')
 * @returns boolean - true si tiene acceso, false si no
 */
export const hasAccess = async (userId: string, productType: ProductType): Promise<boolean> => {
  try {
    // Buscar si el usuario tiene una compra del producto especificado
    const purchase = await prisma.purchase.findFirst({
      where: {
        userId,
        product: {
          type: productType,
          isActive: true
        }
      }
    })

    return !!purchase
  } catch (error) {
    console.error('Error checking access:', error)
    return false
  }
}

/**
 * Obtiene todas las compras de un usuario
 * @param userId - ID del usuario
 * @returns Array de compras con información del producto
 */
export const getUserPurchases = async (userId: string) => {
  try {
    const purchases = await prisma.purchase.findMany({
      where: { userId },
      include: {
        product: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return purchases
  } catch (error) {
    console.error('Error getting user purchases:', error)
    return []
  }
}

/**
 * Asigna un producto a un usuario (crea una compra)
 * @param userId - ID del usuario
 * @param productId - ID del producto
 * @returns Resultado de la operación
 */
export const assignProductToUser = async (userId: string, productId: string) => {
  try {
    // Verificar que el producto existe y está activo
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        isActive: true
      }
    })

    if (!product) {
      return {
        ok: false,
        message: 'Product not found or inactive'
      }
    }

    // Verificar que el usuario no tenga ya este producto
    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    })

    if (existingPurchase) {
      return {
        ok: false,
        message: 'User already has this product'
      }
    }

    // Crear la compra
    const purchase = await prisma.purchase.create({
      data: {
        userId,
        productId
      },
      include: {
        product: true
      }
    })

    return {
      ok: true,
      message: 'Product assigned successfully',
      purchase
    }
  } catch (error) {
    console.error('Error assigning product to user:', error)
    return {
      ok: false,
      message: 'Error assigning product'
    }
  }
}