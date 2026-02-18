import { NextRequest, NextResponse } from 'next/server';
import { updateAccountInformation } from '../../../actions/account';
import { requireAuth } from '../../../actions/auth';
import { z } from 'zod';

const updateAccountSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(255, 'Name too long').optional(),
  lastName: z.string().min(1, 'Last name is required').max(255, 'Name too long').optional(),
  phone: z.string().optional(),
  address: z.object({
    line1: z.string().min(1, 'Address line 1 is required'),
    line2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postal_code: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Add authentication check
    const { userId } = await requireAuth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate input schema
    const validatedData = updateAccountSchema.parse(data);
    
    // updateAccountInformation handles its own authentication
    const result = await updateAccountInformation(validatedData);
    
    if (result.success) {
      return NextResponse.json({ success: true, message: result.message });
    } else {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Account update API error:', error);
    return NextResponse.json(
      { error: 'Failed to update account information' },
      { status: 500 }
    );
  }
}