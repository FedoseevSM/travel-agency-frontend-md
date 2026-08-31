export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: string
          title: string
          titleEn: string | null
          description: string
          imageUrl: string
          categories: string[]
          location: string
          city: string
          'duration.days': number
          'duration.nights': number
          'price.adult': number
          'price.child': number
          'price.amount': number
          'price.currency': string
          included: string[]
          notIncluded: string[]
          requirements: string[]
          itinerary: {
            day: number
            activities: string[]
          }[]
          pricingOptions: {
            id: string
            name: string
            description?: string
            price: {
              adult: number
              child: number
              currency: string
            }
          }[]
          active: boolean
        }
        Insert: {
          id: string
          title: string
          titleEn?: string | null
          description: string
          imageUrl: string
          categories: string[]
          location: string
          city: string
          'duration.days': number
          'duration.nights': number
          'price.adult': number
          'price.child': number
          'price.amount': number
          'price.currency': string
          included: string[]
          notIncluded: string[]
          requirements: string[]
          itinerary: {
            day: number
            activities: string[]
          }[]
          pricingOptions?: {
            id: string
            name: string
            description?: string
            price: {
              adult: number
              child: number
              currency: string
            }
          }[]
          active?: boolean
        }
        Update: {
          id?: string
          title?: string
          titleEn?: string | null
          description?: string
          imageUrl?: string
          categories?: string[]
          location?: string
          city?: string
          'duration.days'?: number
          'duration.nights'?: number
          'price.adult'?: number
          'price.child'?: number
          'price.amount'?: number
          'price.currency'?: string
          included?: string[]
          notIncluded?: string[]
          requirements?: string[]
          itinerary?: {
            day: number
            activities: string[]
          }[]
          pricingOptions?: {
            id: string
            name: string
            description?: string
            price: {
              adult: number
              child: number
              currency: string
            }
          }[]
          active?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}