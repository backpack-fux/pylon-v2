import type {
  Merchant as BaseMerchant,
  Compliance as BaseCompliance,
  User as BaseUser,
  RegisteredPasskey as BaseRegisteredPasskey,
} from '@prisma/client';

export { User as BaseUser } from '@prisma/client';

export type PrismaSelectedCompliance = Pick<
  BaseCompliance,
  'verificationDocumentLink' | 'termsOfServiceLink'
>;

export type PrismaMerchant = BaseMerchant;
export type PrismaUser = BaseUser;
export type PrismaRegisteredPasskey = BaseRegisteredPasskey;
