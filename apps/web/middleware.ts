import { NextRequest, NextResponse } from 'next/server';

// apps/web/middleware.ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (pathname === '/' || pathname === '/login' || pathname === '/dev') {
    return NextResponse.next();
  }

  const url = new URL(request.url);
  const urlToken = url.searchParams.get('token');
  const token = request.cookies.get('token')?.value;

  // If we have a URL token, validate and set cookie
  if (urlToken) {
    const response = NextResponse.next();
    response.cookies.set('token', urlToken, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return response;
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

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|installHook.js.map).*)',
  ],
};
