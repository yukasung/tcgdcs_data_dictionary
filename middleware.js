import { NextResponse } from 'next/server'
import { validCredentials } from './lib/docs-access.mjs'

export async function middleware(request) {
  const password = process.env.DOCS_ACCESS_PASSWORD
  const headers = {
    'Cache-Control': 'private, no-store, max-age=0',
    'X-Robots-Tag': 'noindex, nofollow, noarchive'
  }
  if (!password) {
    return new NextResponse('Site access is not configured.', { status: 503, headers })
  }
  if (!(await validCredentials(request.headers.get('authorization'), password))) {
    return new NextResponse('Please sign in to view TCGDCS documentation.', {
      status: 401,
      headers: { ...headers, 'WWW-Authenticate': 'Basic realm="TCGDCS Docs", charset="UTF-8"' }
    })
  }
  const response = NextResponse.next()
  for (const [key, value] of Object.entries(headers)) response.headers.set(key, value)
  return response
}

// Includes search indexes, assets, RSC requests and document routes.
export const config = { matcher: '/:path*' }
