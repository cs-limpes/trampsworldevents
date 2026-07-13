export type EventCategory =
  | 'car-show'
  | 'motorcycle-event'
  | 'boat-water-event'
  | 'off-road-event'
  | 'race'
  | 'rally-ride'
  | 'meet-cruise'
  | 'festival'
  | 'expo-trade-show'
  | 'swap-meet-market'
  | 'community'
  | 'other'

export type EventAudience =
  | 'all-ages'
  | 'family-friendly'
  | 'adults'
  | '18-plus'
  | '21-plus'
  | 'youth'
  | 'unknown'

export type EventPriceType =
  | 'free'
  | 'paid'
  | 'donation'
  | 'registration-required'
  | 'unknown'

export type EventStatus = 'confirmed' | 'tentative' | 'cancelled'

export type TrampsWorldState = 'AZ' | 'CA' | 'NV' | 'NM' | 'unknown'

export type TrampsWorldVertical =
  | 'hotrodtramp'
  | 'cycletramp'
  | 'rivertramp'
  | 'dirttramp'
  | 'unclassified'

export type PublicEvent = {
  id: string
  source: {
    provider: 'google-calendar'
    eventId: string
    recurringEventId?: string
    originalStartTime?: string
    htmlLink?: string
  }

  title: string
  slug?: string
  description?: string
  excerpt?: string

  start: string
  end: string
  timezone?: string
  allDay: boolean
  multiDay: boolean
  status: EventStatus

  venue?: {
    name?: string
    address?: string
    city?: string
    state: TrampsWorldState
    region?: string
    neighborhood?: string
    mapUrl?: string
    online: boolean
  }

  taxonomy: {
    vertical: TrampsWorldVertical
    primaryCategory: EventCategory
    tags: string[]
    audience: EventAudience[]
    priceType: EventPriceType
  }

  pricing?: {
    displayText?: string
    minimum?: number
    maximum?: number
    currency?: 'USD'
    ticketUrl?: string
  }

  organizer?: {
    name?: string
    url?: string
  }

  media?: {
    imageUrl?: string
    imageAlt?: string
    flyerUrl?: string
    visualKey: string
  }

  links: {
    sourceUrl?: string
    registrationUrl?: string
    websiteUrl?: string
    videoUrl?: string
    galleryUrl?: string
  }

  editorial: {
    featured: boolean
    promoted: boolean
    sponsored: boolean
    sponsorName?: string
    coverageStatus?: 'none' | 'planned' | 'published'
  }

  accessibility?: {
    text?: string
  }

  updatedAt?: string
  createdAt?: string
}

export type EventsResponse = {
  events: PublicEvent[]
  range: {
    start: string
    end: string
    timezone: string
  }
  generatedAt: string
}

export type ApiErrorResponse = {
  error: {
    code: string
    message: string
  }
}
