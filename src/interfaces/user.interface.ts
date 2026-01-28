import { Role } from '@prisma/client'

export interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean | null
  phoneNumber: string
  phoneNumberVerified: boolean | null
  isActive: boolean
  image?: string | null
  role: Role
  password: string
  avatarUrl?: string;
  subscriptionPlan?: {
    name: string;
    price: string;
    nextBillingDate: string;
    paymentMethod?: string;
    billingHistory?: { date: string; amount: string }[];
  };
  learningMaterials?: {
    title: string;
    type: string;
    date: string;
  }[];
}
