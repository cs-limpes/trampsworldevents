import type {
  EventAudience,
  EventCategory,
  EventPriceType,
  TrampsWorldState,
  TrampsWorldVertical,
} from '../types/events'

export const TRAMPSWORLD_STATES: TrampsWorldState[] = ['AZ', 'CA', 'NV', 'NM', 'unknown']

export const TRAMPSWORLD_VERTICALS: TrampsWorldVertical[] = [
  'hotrodtramp',
  'cycletramp',
  'rivertramp',
  'dirttramp',
  'unclassified',
]

export const EVENT_CATEGORIES: EventCategory[] = [
  'car-show',
  'motorcycle-event',
  'boat-water-event',
  'off-road-event',
  'race',
  'rally-ride',
  'meet-cruise',
  'festival',
  'expo-trade-show',
  'swap-meet-market',
  'community',
  'other',
]

export const EVENT_AUDIENCES: EventAudience[] = [
  'all-ages',
  'family-friendly',
  'adults',
  '18-plus',
  '21-plus',
  'youth',
  'unknown',
]

export const EVENT_PRICE_TYPES: EventPriceType[] = ['free', 'paid', 'donation', 'registration-required', 'unknown']

const LABEL_OVERRIDES: Record<string, string> = {
  '18-plus': '18+',
  '21-plus': '21+',
  'all-ages': 'All ages',
  'boat-water-event': 'Boat / Water Event',
  'car-show': 'Car Show',
  cycletramp: 'CycleTramp',
  dirttramp: 'DirtTramp',
  'expo-trade-show': 'Expo / Trade Show',
  'family-friendly': 'Family-friendly',
  hotrodtramp: 'HotRodTramp',
  'meet-cruise': 'Meet / Cruise',
  'motorcycle-event': 'Motorcycle Event',
  'off-road-event': 'Off-road Event',
  'rally-ride': 'Rally / Ride',
  'registration-required': 'Registration required',
  rivertramp: 'RiverTramp',
  'swap-meet-market': 'Swap Meet / Market',
  unclassified: 'Unclassified',
  unknown: 'Unknown',
}

const STATE_LABELS: Record<TrampsWorldState, string> = {
  AZ: 'Arizona',
  CA: 'California',
  NV: 'Nevada',
  NM: 'New Mexico',
  unknown: 'State unknown',
}

export function formatFilterLabel(value: string): string {
  if (LABEL_OVERRIDES[value]) {
    return LABEL_OVERRIDES[value]
  }

  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function formatStateLabel(value: TrampsWorldState): string {
  return STATE_LABELS[value]
}

export function formatKnownState(value: TrampsWorldState | undefined): string | undefined {
  return value && value !== 'unknown' ? value : undefined
}

export function formatVerticalLabel(value: TrampsWorldVertical): string {
  return formatFilterLabel(value)
}
