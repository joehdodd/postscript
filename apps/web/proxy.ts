import { NextRequest, NextResponse } from 'next/server';
import { validateTokenForMiddleware } from './lib/auth-middleware';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/dev' ||
    pathname === '/pricing'
  ) {
    console.log('Public route accessed:', pathname);
    return NextResponse.next();
  }

  const url = new URL(request.url);
  const urlToken = url.searchParams.get('token');
  const token = request.cookies.get('token')?.value;

  if (urlToken) {
    try {
      // Validate token before setting cookie
      const payload = await validateTokenForMiddleware(urlToken);
      if (!payload) {
        console.warn('Invalid token provided in URL parameter');
        return NextResponse.redirect(new URL('/?error=invalid_token', request.url));
      }
      
      // Token is valid, set cookie and proceed
      const response = NextResponse.next();
      response.cookies.set('token', urlToken, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      return response;
    } catch (error) {
      console.error('Token validation failed:', error);
      return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
    }
  }

  if (token) {
    try {
      // Validate existing cookie token
      const payload = await validateTokenForMiddleware(token);
      if (!payload) {
        console.warn('Invalid token found in cookie, clearing and redirecting');
        const response = NextResponse.redirect(new URL('/?error=session_expired', request.url));
        response.cookies.delete('token');
        return response;
      }
      
      // Token is valid, refresh cookie expiry and proceed
      const response = NextResponse.next();
      response.cookies.set('token', token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      return response;
    } catch (error) {
      console.error('Cookie token validation failed:', error);
      const response = NextResponse.redirect(new URL('/?error=auth_failed', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|installHook.js.map).*)',
  ],
};
