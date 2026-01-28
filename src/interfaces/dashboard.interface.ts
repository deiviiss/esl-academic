export interface UserSubscriptionData {
  name: string
  price: string
  nextBillingDate: string
  paymentMethod?: string
  billingHistory?: {
    date: string
    amount: string
  }[]
}

export interface LearningMaterialItem {
  title: string
  type: 'video' | 'pdf' | 'link'
  date: string
}
