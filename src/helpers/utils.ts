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
    body: string | unknown,
    signature: string
  ) {
    const hash = createHash('SHA256');
    hash.update(timestamp + '.' + body);

    const verifier = createVerify('SHA256');
    verifier.update(hash.digest());
    verifier.end();

    return verifier.verify(
      Config.bridgeWebhookPublicKey as KeyLike,
      Buffer.from(signature, 'base64')
    );
  },
};
