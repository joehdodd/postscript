import { NextRequest, NextResponse } from 'next/server';
import { validateTokenForMiddleware } from './lib/auth-middleware';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API route protection - handle API routes first
  if (pathname.startsWith('/api/')) {
    // Skip webhook endpoints (they use signature verification)
    if (pathname.startsWith('/api/stripe/webhooks')) {
      return NextResponse.next();
    }
    
    // Require authentication for all other API routes
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const user = await validateTokenForMiddleware(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Add user info to request headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.userId);
    requestHeaders.set('x-user-email', user.email);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Page route authentication (existing logic)
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
    // Match all request paths except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|installHook.js.map).*)',
    // Include API routes for authentication
    '/api/(.*)',
  ],
};
