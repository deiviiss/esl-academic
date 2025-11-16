export interface Product {
  id: string
  name: string
  type: string
  price: number
  isActive: boolean
}

export interface Purchase {
  id: string
  userId: string
  productId: string
  createdAt: Date
  product: Product
}

export type ProductType = 'academy' | 'course'