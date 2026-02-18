import { NextRequest, NextResponse } from 'next/server';
import { refreshAccessToken, revokeRefreshToken } from '../../../../lib/auth';
import { z } from 'zod';

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate input schema
    const { refreshToken } = refreshTokenSchema.parse(data);
    
    // Attempt to refresh the access token
    const result = await refreshAccessToken(refreshToken);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }
    
    // Set new access token as httpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
    });
    
    response.cookies.set('token', result.accessToken, {
      path: '/',
      maxAge: 60 * 60, // 1 hour
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    
    response.cookies.set('refreshToken', result.newRefreshToken, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    const { refreshToken } = refreshTokenSchema.parse(data);
    
    // This would revoke the refresh token (logout)
    const success = await revokeRefreshToken(refreshToken);
    
    const response = NextResponse.json({
      success,
      message: success ? 'Logged out successfully' : 'Token not found',
    });
    
    // Clear cookies
    response.cookies.delete('token');
    response.cookies.delete('refreshToken');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}