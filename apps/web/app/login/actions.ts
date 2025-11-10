"use server";
import { generateMagicLinkToken } from '@/lib/auth';
import { sendMagicLinkEmail } from '@/lib/email';

export async function sendMagicLink(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Generate magic link token
    const token = await generateMagicLinkToken(email);
    if (!token) {
      return { success: false, error: "User not found." };
    }
    // Compose magic link URL
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || "https://postscript.ink"}/?token=${token}`;
    console.log('Generated magic link URL:', url);
    // Send email
    await sendMagicLinkEmail(email, url);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Unknown error." };
  }
}
