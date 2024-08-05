import { Config } from '@/config';
import { prisma } from '@/db';
import { UUID, createHash, createVerify, KeyLike, generateKey } from 'crypto';
import { TosStatus, VerificationStatus } from '@prisma/client';
import { TransactionProcessor } from '@/v1/types/transaction';
import { MerchantIdentifier } from '@/v1/types/merchant';
import { BridgeErrorResponse } from '@/v1/types/bridge/error';

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
  getCurrentDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
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

    return verifier.verify(Config.bridge.webhookPublicKey, decodedSignature);
  },
  formattedKycStatus: (status: string): VerificationStatus => {
    const uppercaseStatus = status.toUpperCase();
    return VerificationStatus[
      uppercaseStatus as keyof typeof VerificationStatus
    ];
  },
  formattedTosStatus: (status: string): TosStatus => {
    const uppercaseStatus = status.toUpperCase();
    return TosStatus[uppercaseStatus as keyof typeof TosStatus];
  },
  generateTokenDescription: (paymentProcessor: TransactionProcessor) => {
    return `${paymentProcessor}-token-${utils.generateUUID()}`;
  },
  generateTransactionReference: (
    MerchantId: MerchantIdentifier,
    transactionId: UUID
  ) => {
    return `${MerchantId}-${transactionId}-${utils.getCurrentDate()}`;
  },
  extractTokenFromUrl(url: string): string {
    const parts = url.split('/');
    const token = parts[parts.length - 1];
    return token;
  },
};
