import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for home page and other public routes
  if (pathname === '/' || pathname === '/login') {
    return NextResponse.next();
  }

  // Try to get token from cookies
  let token = request.cookies.get('token')?.value;

  // Try to get token from URL (search params)
  const url = new URL(request.url);
  const urlToken = url.searchParams.get('token');

  const response = NextResponse.next();

  const maxAge = 60 * 60 * 24 * 7; // 7 days in seconds

  if (urlToken && urlToken !== token) {
    // If token is in URL and different from cookie, set it in cookies
    response.cookies.set('token', urlToken, { path: '/', maxAge });
    token = urlToken;
  } else if (token) {
    // Refresh cookie expiration if token is present
    response.cookies.set('token', token, { path: '/', maxAge });
  }

  // If neither cookie nor URL has a token, redirect to home
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

// Optionally, export config for matcher if you want to limit middleware scope
export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico|installHook.js.map).*)'] };
