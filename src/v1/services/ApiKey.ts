import { prisma } from '@/db';
import { getRandomValues, randomUUID, UUID } from 'crypto';
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
  public async createKey(userId: UUID): Promise<string> {
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

  // Get active keys by userId
  public async getKeysByUserId(
    userId: UUID
  ): Promise<Pick<PrismaApiKey, 'key'>[]> {
    return await prisma.apiKey.findMany({
      where: {
        userId,
        isActive: true,
      },
      select: {
        key: true,
      },
    });
  }

  // Get active keys by key
  public async getKeysByKey(key: string): Promise<Pick<PrismaApiKey, 'key'>[]> {
    return await prisma.apiKey.findMany({
      where: {
        key,
        isActive: true,
      },
      select: {
        key: true,
      },
    });
  }
}
