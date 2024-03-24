import type {
  Merchant as BaseMerchant,
  Compliance as BaseCompliance,
} from '@prisma/client';

export type PrismaSelectedCompliance = Pick<
  BaseCompliance,
  'verificationDocumentLink' | 'termsOfServiceLink'
>;

export type PrismaMerchant = BaseMerchant;
