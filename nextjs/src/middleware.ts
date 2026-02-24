import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Pass the current pathname to the root layout via headers
    response.headers.set('x-pathname', request.nextUrl.pathname);

    return response;
}

export const config = {
    matcher: [
        // Match all routes except static assets and API routes
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
