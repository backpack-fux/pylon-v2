import type {
  Merchant as BaseMerchant,
  Compliance as BaseCompliance,
  User as BaseUser,
} from '@prisma/client';

export type PrismaSelectedCompliance = Pick<
  BaseCompliance,
  'verificationDocumentLink' | 'termsOfServiceLink'
>;

export type PrismaMerchant = BaseMerchant;
export type PrismaUser = BaseUser;
