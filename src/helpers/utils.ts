import { Config } from '@/config';
import { prisma } from '@/db';
import { UUID, createHash, createVerify, KeyLike } from 'crypto';

export const utils = {
  isJSON: (data: string) => {
    try {
      JSON.parse(data);
    } catch (e) {
      return false;
    }
    return true;
  },
  getTime: () => {
    const date = new Date();
    const time = date.getTime();
    return time;
  },
  healthCheck: (): Promise<void> => {
    return new Promise((resolve, reject) => {
      prisma.$queryRaw`SELECT 1`
        .then(() => {
          resolve();
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  },
  generateUUID: (): UUID => {
    return crypto.randomUUID();
  },
  getFullName: (name: string, surname: string) => {
    return name + ' ' + surname;
  },
  verifySignature(
    timestamp: string,
    rawBody: string | unknown,
    encodedSignature: string
  ) {
    // Generate SHA256 digest of timestamp and raw body
    const hash = createHash('sha256');
    hash.update(timestamp + '.' + rawBody);
    const digest = hash.digest();

    // Decode the encoded signature with base64
    const decodedSignature = Buffer.from(encodedSignature, 'base64');

    // Verify the signature
    const verifier = createVerify('sha256');
    verifier.update(digest);

    return verifier.verify(Config.bridgeWebhookPublicKey, decodedSignature);
  },
};
