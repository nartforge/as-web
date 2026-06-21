export interface User {
  id: string
  name: string
  email: string
  passwordHash?: string
  discordId?: string
  discordUsername?: string
  discordAvatar?: string
  avatar?: string
  provider: 'email' | 'discord'
  role: 'user' | 'admin'
  createdAt: string
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  isVerifiedBuyer: boolean
  createdAt: string
}

export interface Order {
  id: string
  userId: string
  productId: string
  productName: string
  price: string
  paymentMethod: 'shopier' | string
  paymentProvider: string
  status: 'pending' | 'paid' | 'failed' | 'delivered' | 'cancelled'
  shopierPaymentUrl?: string
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  productId: string
  name: string
  price: string
  quantity: number
  image?: string
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  title?: string
}

export interface Feature {
  title: string
  description: string
  icon?: string
}

export interface InstallStep {
  step: number
  title: string
  description: string
  code?: string
  type?: 'info' | 'warning' | 'success'
}

export interface ProductCommand {
  command: string
  description: string
  permission: string
  example: string
}

export interface ErrorSolution {
  id: string
  title: string
  errorMessage: string
  possibleCause: string
  solution: string
  severity: 'common' | 'critical' | 'easy-fix'
}

export interface WikiInstallStep {
  step: number
  title: string
  content: string
  code?: string
  type?: 'info' | 'warning' | 'success'
}

export interface WikiCommand {
  command: string
  description: string
  permission: string
  example?: string
}

export interface WikiDetail {
  productId: string
  version: string
  supportedVersions: string[]
  requirements: string[]
  installationSteps: WikiInstallStep[]
  commands: WikiCommand[]
  errors: ErrorSolution[]
}

export interface ProductDetail {
  id: string
  name: string
  slug: string
  shortDescription: string
  longDescription: string
  price: string
  currency: string
  category: string
  mainCategory: string
  status: 'active' | 'beta' | 'coming-soon' | 'development'
  badges: string[]
  logo?: string
  images: ProductImage[]
  version: string
  compatibility: string[]
  features: Feature[]
  requirements: string[]
  useCases: string[]
  installationSteps: InstallStep[]
  commands: ProductCommand[]
  errorSolutions: ErrorSolution[]
  isPremium: boolean
  isFeatured: boolean
  accentColor?: string
  createdAt: string
  updatedAt: string
}

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'delivered' | 'cancelled'
export type ReviewStatus = 'pending' | 'approved' | 'rejected'
export type ProductStatus = 'active' | 'beta' | 'coming-soon' | 'development'
