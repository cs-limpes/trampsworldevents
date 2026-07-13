import {
  findEventByDetailPath,
  getEventCanonicalUrl,
  getEventSummary,
} from '../../src/lib/event-detail'
import type { PublicEvent } from '../../src/types/events'
import { loadEventsResponse, type Env } from './events'

const SOCIAL_IMAGE_PATH = '/img/scampworldsmall.png'
const SOCIAL_IMAGE_ALT = 'TrampsWorld Events'
const SOCIAL_IMAGE_WIDTH = '400'
const SOCIAL_IMAGE_HEIGHT = '405'

export async function handleAppShellRequest(request: Request, env: Env): Promise<Response> {
  const indexResponse = await env.ASSETS.fetch(request)

  if (!isHtmlResponse(indexResponse)) {
    return indexResponse
  }

  const html = await indexResponse.text()
  const url = new URL(request.url)
  const event = url.pathname.startsWith('/events/')
    ? await findEventForShell(url.pathname, url.origin, env)
    : undefined
  const metadata = event
    ? buildEventMetadata(event, url.origin)
    : isContactPath(url.pathname)
      ? buildContactMetadata(url)
      : buildDefaultMetadata(url)

  return new Response(injectMetadata(html, metadata), {
    status: indexResponse.status,
    headers: indexResponse.headers,
  })
}

type PageMetadata = {
  title: string
  description: string
  url: string
  type: string
  imageUrl: string
}

async function findEventForShell(pathname: string, origin: string, env: Env): Promise<PublicEvent | undefined> {
  const result = await loadEventsResponse(new URLSearchParams(), env)

  if (!result.ok) {
    return undefined
  }

  return findEventByDetailPath(result.response.events, new URL(pathname, origin).pathname)
}

function buildEventMetadata(event: PublicEvent, origin: string): PageMetadata {
  return {
    title: `${event.title} | TrampsWorld Events`,
    description: getEventSummary(event),
    url: getEventCanonicalUrl(event, origin),
    type: 'article',
    imageUrl: buildSocialImageUrl(origin),
  }
}

function buildDefaultMetadata(url: URL): PageMetadata {
  return {
    title: 'TrampsWorld Events',
    description: 'A live regional agenda for Arizona, California, Nevada, and New Mexico.',
    url: `${url.origin}${url.pathname}`,
    type: 'website',
    imageUrl: buildSocialImageUrl(url.origin),
  }
}

function buildContactMetadata(url: URL): PageMetadata {
  return {
    title: 'Send Event Updates | TrampsWorld Events',
    description: 'Send TrampsWorld Events a correction or a new event lead for editorial review.',
    url: `${url.origin}${url.pathname}`,
    type: 'website',
    imageUrl: buildSocialImageUrl(url.origin),
  }
}

function isContactPath(pathname: string): boolean {
  return pathname === '/contact' || pathname === '/submit'
}

function injectMetadata(html: string, metadata: PageMetadata): string {
  const escapedTitle = escapeHtml(metadata.title)
  const tags = [
    `<title>${escapedTitle}</title>`,
    `<meta name="description" content="${escapeHtml(metadata.description)}" />`,
    `<meta property="og:title" content="${escapedTitle}" />`,
    `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`,
    `<meta property="og:type" content="${escapeHtml(metadata.type)}" />`,
    `<meta property="og:url" content="${escapeHtml(metadata.url)}" />`,
    `<meta property="og:image" content="${escapeHtml(metadata.imageUrl)}" />`,
    `<meta property="og:image:width" content="${SOCIAL_IMAGE_WIDTH}" />`,
    `<meta property="og:image:height" content="${SOCIAL_IMAGE_HEIGHT}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(SOCIAL_IMAGE_ALT)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:image" content="${escapeHtml(metadata.imageUrl)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(SOCIAL_IMAGE_ALT)}" />`,
    `<link rel="canonical" href="${escapeHtml(metadata.url)}" />`,
  ].join('\n    ')

  const withoutTitle = html.replace(/<title>[\s\S]*?<\/title>/i, '')
  return withoutTitle.replace('</head>', `    ${tags}\n  </head>`)
}

function buildSocialImageUrl(origin: string): string {
  return new URL(SOCIAL_IMAGE_PATH, origin).toString()
}

function isHtmlResponse(response: Response): boolean {
  return response.headers.get('content-type')?.includes('text/html') ?? false
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
