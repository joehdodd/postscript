import { NextRequest, NextResponse } from 'next/server';

// apps/web/middleware.ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/' || pathname === '/login') {
    return NextResponse.next();
  }

  const url = new URL(request.url);
  const urlToken = url.searchParams.get('token');
  let token = request.cookies.get('token')?.value;

  // If we have a URL token, use it and update cookie
  if (urlToken) {
    token = urlToken;
    const response = NextResponse.next();
    response.cookies.set('token', urlToken, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true, // SECURITY: prevent XSS
      secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
      sameSite: 'lax', // CSRF protection
    });

    // Clean URL by removing token param
    url.searchParams.delete('token');
    return NextResponse.redirect(url, { status: 302 });
  }

  // Refresh existing cookie
  if (token) {
    const response = NextResponse.next();
    response.cookies.set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return response;
  }

  // No token found - redirect to home
  return NextResponse.redirect(new URL('/', request.url));
}

// Optionally, export config for matcher if you want to limit middleware scope
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|installHook.js.map).*)',
  ],
};
