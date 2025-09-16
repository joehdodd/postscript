import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const MAGIC_LINK_SECRET = process.env.MAGIC_LINK_SECRET || 'supersecret';
const MAGIC_LINK_EXPIRY = '15m'; // 15 minutes

@Injectable()
export class MagicLinkService {
  async generateToken(email: string, promptId: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    const userId = user.id;
    return jwt.sign({ userId, promptId }, MAGIC_LINK_SECRET, { expiresIn: MAGIC_LINK_EXPIRY });
  }

  validateToken(token: string): { userId: string; promptId: string } | null {
    try {
      const payload = jwt.verify(token, MAGIC_LINK_SECRET) as { userId: string; promptId: string };
      console.log('Token payload:', payload);
      return payload;
    } catch {
      return null;
    }
  }
}
