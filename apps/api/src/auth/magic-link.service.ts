import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

const MAGIC_LINK_SECRET = process.env.MAGIC_LINK_SECRET || 'supersecret';
const MAGIC_LINK_EXPIRY = '15m'; // 15 minutes

@Injectable()
export class MagicLinkService {
  generateToken(userId: string, promptId: string): string {
    return jwt.sign({ userId, promptId }, MAGIC_LINK_SECRET, { expiresIn: MAGIC_LINK_EXPIRY });
  }

  validateToken(token: string): { userId: string; promptId: string } | null {
    try {
      const payload = jwt.verify(token, MAGIC_LINK_SECRET) as { userId: string; promptId: string };
      return payload;
    } catch {
      return null;
    }
  }
}
