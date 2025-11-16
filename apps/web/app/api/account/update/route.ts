import { NextRequest, NextResponse } from 'next/server';
import { updateAccountInformation } from '../../../actions/account';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const result = await updateAccountInformation(data);
    
    if (result.success) {
      return NextResponse.json({ success: true, message: result.message });
    } else {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Account update API error:', error);
    return NextResponse.json(
      { error: 'Failed to update account information' },
      { status: 500 }
    );
  }
}