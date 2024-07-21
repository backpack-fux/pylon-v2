import { prisma } from '@/db';
import { getRandomValues, randomUUID } from 'crypto';
import { PrismaApiKey } from '../types/prisma';
import { bpApiKey } from '../types/apiKey';

export class ApiKeyService {
  private static instance: ApiKeyService;

  public static getInstance(): ApiKeyService {
    if (!ApiKeyService.instance) {
      ApiKeyService.instance = new ApiKeyService();
    }
    return ApiKeyService.instance;
  }

  private generateKey(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const keyLength = 32;
    let result = 'bp';

    for (let i = 0; i < keyLength; i++) {
      const randomIndex = Math.floor(
        (getRandomValues(new Uint8Array(1))[0] / 256) * characters.length
      );
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  // Create key
  public async createKey(userId: number): Promise<string> {
    const key = await prisma.apiKey.create({
      data: {
        key: this.generateKey(),
        userId,
      },
    });

    return key.key;
  }

  // Delete key
  public async deleteKey(key: bpApiKey): Promise<void> {
    await prisma.apiKey.delete({
      where: {
        key,
      },
    });
  }

  // Get keys by userId
  public async getKeysByUserId(userId: number): Promise<PrismaApiKey[]> {
    return await prisma.apiKey.findMany({
      where: {
        userId,
      },
    });
  }
}
