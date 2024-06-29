import crypto from 'crypto';
import { prisma } from '@/db';

export class AuthService {
  protected prisma = prisma;

  public async generateChallenge() {
    const randomBuffer = new Uint8Array(32);
    crypto.randomFillSync(randomBuffer);
    return Buffer.from(randomBuffer).toString('hex');
  }
}
